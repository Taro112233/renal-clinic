// app/api/counseling/[id]/route.ts
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

const UpdateCounselingSchema = z.object({
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const record = await prisma.counselingRecord.findUnique({
      where: { id },
      include: {
        nonComplianceItems: { orderBy: { orderNumber: 'asc' } },
        drpItems: { orderBy: { orderNumber: 'asc' } },
        patient: {
          select: {
            id: true, hn: true, prefix: true,
            firstName: true, lastName: true,
            gender: true, dateOfBirth: true,
            caseType: true, status: true, healthScheme: true,
            diagnoses: { select: { id: true, diagnosis: true, isPrimary: true } },
          },
        },
        pharmacist: { select: { id: true, name: true } },
      },
    });

    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Get counseling record error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { role } = session.user as SessionUser;

    const existing = await prisma.counselingRecord.findUnique({
      where: { id },
      select: { pharmacistId: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    if (role !== 'SUPERADMIN' && existing.pharmacistId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = UpdateCounselingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const d = parsed.data;

    // Delete nested records first, then recreate
    await prisma.$transaction([
      prisma.nonComplianceItem.deleteMany({ where: { counselingRecordId: id } }),
      prisma.drpItem.deleteMany({ where: { counselingRecordId: id } }),
    ]);

    const record = await prisma.counselingRecord.update({
      where: { id },
      data: {
        date: new Date(d.date),
        patientId: d.patientId,
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
        alcoholStatus: d.alcoholStatus ?? null,
        herbStatus: d.herbStatus ?? null,
        smokingStatus: d.smokingStatus ?? null,
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

    console.log(`✅ Counseling record updated: ${id} by ${session.user.id}`);
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Update counseling error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}