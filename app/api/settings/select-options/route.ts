// app/api/settings/select-options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const CreateSelectOptionSchema = z.object({
  category: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  sortOrder: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const options = await prisma.selectOption.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });

  const grouped = options.reduce<Record<string, typeof options>>((acc, opt) => {
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  return NextResponse.json({ success: true, data: grouped });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = CreateSelectOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const option = await prisma.selectOption.create({
      data: {
        category: parsed.data.category,
        value: parsed.data.value,
        label: parsed.data.label,
        sortOrder: parsed.data.sortOrder,
        metadata: parsed.data.metadata
          ? (parsed.data.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
    return NextResponse.json({ success: true, data: option }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'ค่า value นี้มีอยู่แล้วใน category นี้' },
        { status: 409 }
      );
    }
    throw err;
  }
}