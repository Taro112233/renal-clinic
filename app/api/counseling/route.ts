// app/api/counseling/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
  alcoholStatus: z.string().optional(),
  herbStatus: z.string().optional(),
  smokingStatus: z.string().optional(),
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
        otherMeds: d.otherMeds,
        historyNote: d.historyNote,
        adrStatus: d.adrStatus,
        adrDescription: d.adrDescription,
        hasHQ: d.hasHQ,
        eyeScreeningStatus: d.eyeScreeningStatus,
        eyeAppointmentStatus: d.eyeAppointmentStatus ?? undefined,
        consultEyeResult: d.consultEyeResult ?? undefined,
        prevEyeDate: d.prevEyeDate ? new Date(d.prevEyeDate) : undefined,
        eyeResult: d.eyeResult,
        nextEyeDate: d.nextEyeDate ? new Date(d.nextEyeDate) : undefined,
        popupHQAction: d.popupHQAction ?? undefined,
        complianceStatus: d.complianceStatus,
        leftoverMeds: d.leftoverMeds ? d.leftoverMeds : undefined,
        alcoholStatus: d.alcoholStatus,
        herbStatus: d.herbStatus,
        smokingStatus: d.smokingStatus,
        nsaidFromOther: d.nsaidFromOther,
        hasDrp: d.hasDrp,
        contraceptionMethod: d.contraceptionMethod,
        hasME: d.hasME,
        meType: d.meType,
        meDescription: d.meDescription,
        meLevel: d.meLevel,
        labDate: d.labDate ? new Date(d.labDate) : undefined,
        wbc: d.wbc ?? undefined,
        absoluteNeutrophil: d.absoluteNeutrophil ?? undefined,
        neutrophilPercent: d.neutrophilPercent ?? undefined,
        ast: d.ast ?? undefined,
        alt: d.alt ?? undefined,
        alp: d.alp ?? undefined,
        uricAcid: d.uricAcid ?? undefined,
        creatinine: d.creatinine ?? undefined,
        albumin: d.albumin ?? undefined,
        hsCRP: d.hsCRP ?? undefined,
        labLevel: d.labLevel,
        hasCyclophosphamide: d.hasCyclophosphamide,
        cyclophosphamideRoute: d.cyclophosphamideRoute ?? undefined,
        cyclophosphamideCumulativeDose: d.cyclophosphamideCumulativeDose ?? undefined,
        note: d.note,
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

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error('Create counseling error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

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

    const { role } = session.user as SessionUser;
    const whereClause = role === 'ADMIN'
      ? { pharmacistId: session.user.id }
      : {};

    const [records, total] = await Promise.all([
      prisma.counselingRecord.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          patient: { select: { hn: true, firstName: true, lastName: true, prefix: true } },
          pharmacist: { select: { name: true } },
        },
      }),
      prisma.counselingRecord.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        records,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Get counseling list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}