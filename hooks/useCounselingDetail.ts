// hooks/useCounselingDetail.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { CreateCounselingRequest } from '@/types/counseling';

export interface CounselingDetail {
  id: string;
  date: string;
  counselingType: 'PRE' | 'POST';
  pharmacistId: string;
  pharmacist: { id: string; name: string };
  patient: {
    id: string;
    hn: string;
    prefix?: string | null;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    dateOfBirth?: string | null;
    caseType: 'NEW' | 'OLD';
    status: string;
    healthScheme: 'UC' | 'SSS' | 'CSMBS' | 'OTHER';
    diagnoses: { id: string; diagnosis: string; isPrimary: boolean }[];
  };

  hasDmards: boolean;
  currentDmards: string[];
  otherMeds?: string | null;

  historyNote?: string | null;

  adrStatus: string;
  adrDescription?: string | null;

  hasHQ: boolean;
  eyeScreeningStatus?: string | null;
  eyeAppointmentStatus?: string | null;
  consultEyeResult?: string | null;
  prevEyeDate?: string | null;
  eyeResult?: string | null;
  nextEyeDate?: string | null;
  popupHQAction?: string | null;

  complianceStatus: string;
  nonComplianceItems: { id: string; orderNumber: number; type: string; description?: string | null }[];

  leftoverMeds?: { drugName: string; quantity: number }[] | null;

  alcoholStatus: string[];
  herbStatus: string[];
  smokingStatus: string[];
  nsaidFromOther?: string | null;

  hasDrp: boolean;
  drpItems: { id: string; orderNumber: number; drugCode?: string | null; drugName: string; drpType: string; consultResult?: string | null }[];

  contraceptionMethod?: string | null;

  hasME: boolean;
  meType?: string | null;
  meDescription?: string | null;
  meLevel?: string | null;

  labDate?: string | null;
  wbc?: number | null;
  absoluteNeutrophil?: number | null;
  neutrophilPercent?: number | null;
  ast?: number | null;
  alt?: number | null;
  alp?: number | null;
  uricAcid?: number | null;
  creatinine?: number | null;
  albumin?: number | null;
  hsCRP?: number | null;
  labLevel?: string | null;

  hasCyclophosphamide: boolean;
  cyclophosphamideRoute?: string | null;
  cyclophosphamideCumulativeDose?: number | null;

  note?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface UseCounselingDetailReturn {
  record: CounselingDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  refetch: () => Promise<void>;
  updateRecord: (data: CreateCounselingRequest) => Promise<boolean>;
}

export function useCounselingDetail(id: string): UseCounselingDetailReturn {
  const [record, setRecord] = useState<CounselingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchRecord = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/counseling/${id}`, { credentials: 'include' });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || 'ไม่สามารถโหลดข้อมูลได้');

      setRecord(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const updateRecord = useCallback(async (data: CreateCounselingRequest): Promise<boolean> => {
    try {
      setUpdating(true);

      const res = await fetch(`/api/counseling/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'อัปเดตไม่สำเร็จ');

      setRecord(json.data);
      toast.success('อัปเดต Counseling สำเร็จ');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'อัปเดตไม่สำเร็จ');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [id]);

  return { record, loading, error, updating, refetch: fetchRecord, updateRecord };
}