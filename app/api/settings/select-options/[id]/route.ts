// app/api/settings/select-options/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const UpdateSelectOptionSchema = z.object({
  label: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = UpdateSelectOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { metadata, ...rest } = parsed.data;

  const updated = await prisma.selectOption.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(metadata !== undefined && {
        metadata: metadata
          ? (metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== 'SUPERADMIN') {
    return NextResponse.json(
      { success: false, error: 'เฉพาะ SUPERADMIN เท่านั้น' },
      { status: 403 }
    );
  }

  await prisma.selectOption.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}