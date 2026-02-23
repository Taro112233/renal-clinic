// app/api/patients/lookup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const hn = new URL(request.url).searchParams.get('hn');
    if (!hn) {
      return NextResponse.json({ success: false, error: 'HN required' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { hn: hn.trim() },
      select: {
        id: true, hn: true, prefix: true,
        firstName: true, lastName: true,
        gender: true, dateOfBirth: true,
        caseType: true, status: true, healthScheme: true,
        diagnoses: {
          select: { id: true, diagnosis: true, isPrimary: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Fetch recent counseling records for dropdown
    const records = await prisma.counselingRecord.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        date: true,
        counselingType: true,
        pharmacist: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: { patient, records },
    });
  } catch (error) {
    console.error('Patient lookup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}