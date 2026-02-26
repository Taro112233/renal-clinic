// app/api/counseling/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { normalizeRole } from '@/lib/auth-helpers';

interface SessionUser {
  id: string;
  role?: string;
}

const NonComplianceItemSchema = z.object({
  orderNumber: z.number().int().min(1).max(3),
  type: z.enum(['WRONG_METHOD', 'FORGOT_DOSE', 'SELF_ADJUST', 'LOSS_FOLLOWUP', 'STOPPED_DUE_TO_ADR']),
  description: z.string().optional(),
});

const DrpItemSchema = z.object({
  orderNumber: z.number().int().min(1).max(2),
  drugCode: z.string().optional(),
  drugName: z.string().min(1),
  drpType: z.string().min(1),
  consultResult: z.string().optional(),
});

const LeftoverMedSchema = z.object({
  drugName: z.string(),
  quantity: z.number(),
});

const CreateCounselingSchema = z.object({
  date: z.string(),
  patientId: z.string().min(1),
  counselingType: z.enum(['PRE', 'POST']),
  hasDmards: z.boolean().default(false),
  currentDmards: z.array(z.string()).default([]),
  otherMeds: z.string().optional(),
  historyNote: z.string().optional(),
  adrStatus: z.enum(['NO', 'YES_DMARD', 'YES_HQ', 'YES_OTHER', 'YES_DMARD_HQ', 'YES_DMARD_OTHER']).default('NO'),
  adrDescription: z.string().optional(),
  hasHQ: z.boolean().default(false),
  eyeScreeningStatus: z.string().optional(),
  eyeAppointmentStatus: z.enum(['YES', 'NO', 'LOSS', 'EXTERNAL_SCREENING']).optional().nullable(),
  consultEyeResult: z.enum(['YES', 'NO', 'NOT_SUGGESTED']).optional().nullable(),
  prevEyeDate: z.string().optional().nullable(),
  eyeResult: z.string().optional(),
  nextEyeDate: z.string().optional().nullable(),
  popupHQAction: z.enum(['SET_NEW', 'UPDATE', 'EXISTING', 'NONE']).optional().nullable(),
  complianceStatus: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'UNABLE_TO_ASSESS']),
  nonComplianceItems: z.array(NonComplianceItemSchema).max(3).default([]),
  leftoverMeds: z.array(LeftoverMedSchema).optional(),
  // ✅ เปลี่ยนเป็น array
  alcoholStatus: z.array(z.string()).default([]),
  herbStatus: z.array(z.string()).default([]),
  smokingStatus: z.array(z.string()).default([]),
  nsaidFromOther: z.string().optional(),
  hasDrp: z.boolean().default(false),
  drpItems: z.array(DrpItemSchema).max(2).default([]),
  contraceptionMethod: z.string().optional(),
  hasME: z.boolean().default(false),
  meType: z.string().optional(),
  meDescription: z.string().optional(),
  meLevel: z.string().optional(),
  labDate: z.string().optional().nullable(),
  wbc: z.number().optional().nullable(),
  absoluteNeutrophil: z.number().optional().nullable(),
  neutrophilPercent: z.number().optional().nullable(),
  ast: z.number().optional().nullable(),
  alt: z.number().optional().nullable(),
  alp: z.number().optional().nullable(),
  uricAcid: z.number().optional().nullable(),
  creatinine: z.number().optional().nullable(),
  albumin: z.number().optional().nullable(),
  hsCRP: z.number().optional().nullable(),
  labLevel: z.string().optional(),
  hasCyclophosphamide: z.boolean().default(false),
  cyclophosphamideRoute: z.enum(['ORAL', 'IV']).optional().nullable(),
  cyclophosphamideCumulativeDose: z.number().optional().nullable(),
  note: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const skip = (page - 1) * limit;

    const sessionUser = session.user as SessionUser;
    const role = normalizeRole(sessionUser.role);
    const isAdminLevel = role === 'ADMIN' || role === 'SUPERADMIN';

    const where = isAdminLevel ? {} : { pharmacistId: session.user.id };

    const [records, total] = await Promise.all([
      prisma.counselingRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          patient: { select: { hn: true, firstName: true, lastName: true } },
          pharmacist: { select: { name: true } },
          nonComplianceItems: true,
          drpItems: true,
        },
      }),
      prisma.counselingRecord.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        records,
        pagination: {
          page, limit, total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get counseling records error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateCounselingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const record = await prisma.counselingRecord.create({
      data: {
        date: new Date(d.date),
        patientId: d.patientId,
        pharmacistId: session.user.id,
        counselingType: d.counselingType,
        hasDmards: d.hasDmards,
        currentDmards: d.currentDmards,
        otherMeds: d.otherMeds ?? null,
        historyNote: d.historyNote ?? null,
        adrStatus: d.adrStatus,
        adrDescription: d.adrDescription ?? null,
        hasHQ: d.hasHQ,
        eyeScreeningStatus: d.eyeScreeningStatus ?? null,
        eyeAppointmentStatus: d.eyeAppointmentStatus ?? undefined,
        consultEyeResult: d.consultEyeResult ?? undefined,
        prevEyeDate: d.prevEyeDate ? new Date(d.prevEyeDate) : null,
        eyeResult: d.eyeResult ?? null,
        nextEyeDate: d.nextEyeDate ? new Date(d.nextEyeDate) : null,
        popupHQAction: d.popupHQAction ?? undefined,
        complianceStatus: d.complianceStatus,
        leftoverMeds: d.leftoverMeds ?? undefined,
        // ✅ array fields
        alcoholStatus: d.alcoholStatus,
        herbStatus: d.herbStatus,
        smokingStatus: d.smokingStatus,
        nsaidFromOther: d.nsaidFromOther ?? null,
        hasDrp: d.hasDrp,
        contraceptionMethod: d.contraceptionMethod ?? null,
        hasME: d.hasME,
        meType: d.meType ?? null,
        meDescription: d.meDescription ?? null,
        meLevel: d.meLevel ?? null,
        labDate: d.labDate ? new Date(d.labDate) : null,
        wbc: d.wbc ?? null,
        absoluteNeutrophil: d.absoluteNeutrophil ?? null,
        neutrophilPercent: d.neutrophilPercent ?? null,
        ast: d.ast ?? null,
        alt: d.alt ?? null,
        alp: d.alp ?? null,
        uricAcid: d.uricAcid ?? null,
        creatinine: d.creatinine ?? null,
        albumin: d.albumin ?? null,
        hsCRP: d.hsCRP ?? null,
        labLevel: d.labLevel ?? null,
        hasCyclophosphamide: d.hasCyclophosphamide,
        cyclophosphamideRoute: d.cyclophosphamideRoute ?? undefined,
        cyclophosphamideCumulativeDose: d.cyclophosphamideCumulativeDose ?? null,
        note: d.note ?? null,
        nonComplianceItems: d.nonComplianceItems.length > 0
          ? { create: d.nonComplianceItems }
          : undefined,
        drpItems: d.drpItems.length > 0
          ? { create: d.drpItems }
          : undefined,
      },
      include: {
        nonComplianceItems: true,
        drpItems: true,
        patient: { select: { hn: true, firstName: true, lastName: true } },
        pharmacist: { select: { name: true } },
      },
    });

    console.log(`✅ Counseling record created: ${record.id} by ${session.user.id}`);
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error('Create counseling error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}