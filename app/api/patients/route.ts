// app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface SessionUser {
  id: string;
  role?: string;
}

const CreatePatientSchema = z.object({
  hn: z.string().min(1, 'กรุณากรอก HN'),
  prefix: z.string().optional(),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  gender: z.enum(['M', 'F']),
  dateOfBirth: z.string().optional().nullable(),
  caseType: z.enum(['NEW', 'OLD']).default('NEW'),
  healthScheme: z.enum(['UC', 'SSS', 'CSMBS', 'OTHER']),
  diagnoses: z.array(z.object({
    diagnosis: z.enum([
      'RA', 'SLE', 'SSC', 'UCTD', 'GOUT', 'PSORA', 'SPA',
      'OVERLAP_SYNDROME', 'DERMATOMYOSITIS', 'BEHCETS_DISEASE',
      'POLYMYALGIA_RHEUMATICA', 'OTHER',
    ]),
    isPrimary: z.boolean().default(false),
  })).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = session.user as SessionUser;
    if (role === 'USER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CreatePatientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const existing = await prisma.patient.findUnique({ where: { hn: d.hn } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'HN นี้มีในระบบแล้ว' },
        { status: 409 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        hn: d.hn,
        prefix: d.prefix || null,
        firstName: d.firstName,
        lastName: d.lastName,
        gender: d.gender,
        dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
        caseType: d.caseType,
        healthScheme: d.healthScheme,
        createdBy: session.user.id,
        diagnoses: d.diagnoses.length > 0
          ? { create: d.diagnoses }
          : undefined,
      },
      include: {
        diagnoses: { select: { id: true, diagnosis: true, isPrimary: true } },
      },
    });

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}