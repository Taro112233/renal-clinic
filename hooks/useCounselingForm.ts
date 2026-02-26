// hooks/useCounselingForm.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type {
  PatientSummary,
  CounselingRecordSummary,
  CreateCounselingRequest,
} from '@/types/counseling';

export interface CreatePatientPayload {
  hn: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth?: string;
  caseType: 'NEW' | 'OLD';
  healthScheme: 'UC' | 'SSS' | 'CSMBS' | 'OTHER';
  diagnoses: { diagnosis: string; isPrimary: boolean }[];
}

export interface UseCounselingFormReturn {
  patient: PatientSummary | null;
  patientLoading: boolean;
  patientRecords: CounselingRecordSummary[];
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  lookupPatient: (hn: string) => Promise<'found' | 'not_found'>;
  clearPatient: () => void;
  createPatient: (payload: CreatePatientPayload) => Promise<boolean>;
  creatingPatient: boolean;
  loadingRecord: boolean;
  loadPreviousRecord: (recordId: string) => Promise<CreateCounselingRequest | null>;
  submitting: boolean;
  submitCounseling: (data: CreateCounselingRequest) => Promise<boolean>;
}

export function useCounselingForm(): UseCounselingFormReturn {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientRecords, setPatientRecords] = useState<CounselingRecordSummary[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);

  const lookupPatient = useCallback(async (hn: string): Promise<'found' | 'not_found'> => {
    if (!hn.trim()) return 'not_found';
    try {
      setPatientLoading(true);
      const res = await fetch(`/api/patients/lookup?hn=${encodeURIComponent(hn.trim())}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPatient(json.data.patient);
        setPatientRecords(json.data.records ?? []);
        setSelectedRecordId(null);
        return 'found';
      }
      setPatient(null);
      setPatientRecords([]);
      setSelectedRecordId(null);
      return 'not_found';
    } catch {
      toast.error('เกิดข้อผิดพลาดในการค้นหาผู้ป่วย');
      return 'not_found';
    } finally {
      setPatientLoading(false);
    }
  }, []);

  const clearPatient = useCallback(() => {
    setPatient(null);
    setPatientRecords([]);
    setSelectedRecordId(null);
  }, []);

  const createPatient = useCallback(async (payload: CreatePatientPayload): Promise<boolean> => {
    try {
      setCreatingPatient(true);
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'สร้างผู้ป่วยไม่สำเร็จ');
      setPatient({
        id: json.data.id,
        hn: json.data.hn,
        prefix: json.data.prefix,
        firstName: json.data.firstName,
        lastName: json.data.lastName,
        gender: json.data.gender,
        dateOfBirth: json.data.dateOfBirth,
        caseType: json.data.caseType,
        status: json.data.status ?? 'ACTIVE',
        healthScheme: json.data.healthScheme,
        diagnoses: json.data.diagnoses ?? [],
      });
      setPatientRecords([]);
      setSelectedRecordId(null);
      toast.success(`เพิ่มผู้ป่วย HN ${json.data.hn} สำเร็จ`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'สร้างผู้ป่วยไม่สำเร็จ');
      return false;
    } finally {
      setCreatingPatient(false);
    }
  }, []);

  const loadPreviousRecord = useCallback(async (recordId: string): Promise<CreateCounselingRequest | null> => {
    try {
      setLoadingRecord(true);
      const res = await fetch(`/api/counseling/${recordId}`, { credentials: 'include' });
      const json = await res.json();
      if (!json.success) {
        toast.error('ไม่สามารถโหลด record ก่อนหน้าได้');
        return null;
      }
      const r = json.data;
      // ✅ Map array fields — fallback [] ถ้า API ส่ง null/undefined มา
      return {
        ...r,
        alcoholStatus: r.alcoholStatus ?? [],
        herbStatus: r.herbStatus ?? [],
        smokingStatus: r.smokingStatus ?? [],
      } as CreateCounselingRequest;
    } catch {
      toast.error('เกิดข้อผิดพลาด');
      return null;
    } finally {
      setLoadingRecord(false);
    }
  }, []);

  const submitCounseling = useCallback(async (data: CreateCounselingRequest): Promise<boolean> => {
    try {
      setSubmitting(true);
      const isUpdate = !!selectedRecordId;
      const url = isUpdate ? `/api/counseling/${selectedRecordId}` : '/api/counseling';
      const method = isUpdate ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'บันทึกไม่สำเร็จ');

      toast.success(isUpdate ? 'อัปเดต Counseling สำเร็จ' : 'บันทึก Counseling สำเร็จ');
      router.push('/counseling');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [router, selectedRecordId]);

  return {
    patient,
    patientLoading,
    patientRecords,
    selectedRecordId,
    setSelectedRecordId,
    lookupPatient,
    clearPatient,
    createPatient,
    creatingPatient,
    loadingRecord,
    loadPreviousRecord,
    submitting,
    submitCounseling,
  };
}