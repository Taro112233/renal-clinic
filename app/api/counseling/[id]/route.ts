// app/api/counseling/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const record = await prisma.counselingRecord.findUnique({
      where: { id: params.id },
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