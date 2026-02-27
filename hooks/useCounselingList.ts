// hooks/useCounselingList.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CounselingType, AdrStatus, ComplianceStatus } from '@/types/counseling';

export interface CounselingListItem {
  id: string;
  date: string;
  counselingType: CounselingType;
  adrStatus: AdrStatus;
  complianceStatus: ComplianceStatus;
  hasDrp: boolean;
  hasCyclophosphamide: boolean;
  patient: {
    hn: string;
    firstName: string;
    lastName: string;
  };
  pharmacist: {
    name: string;
  };
  nonComplianceItems: { id: string; type: string }[];
  drpItems: { id: string; drugName: string }[];
}

export interface CounselingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FetchParams {
  page: number;
  limit: number;
  search: string;
  counselingType: CounselingType | '';
}

interface UseCounselingListReturn {
  records: CounselingListItem[];
  pagination: CounselingPagination | null;
  loading: boolean;
  error: string | null;
  fetchParams: FetchParams;
  setFetchParams: (params: Partial<FetchParams>) => void;
  refetch: () => Promise<void>;
}

export function useCounselingList(): UseCounselingListReturn {
  const [records, setRecords] = useState<CounselingListItem[]>([]);
  const [pagination, setPagination] = useState<CounselingPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchParams, _setFetchParams] = useState<FetchParams>({
    page: 1,
    limit: 20,
    search: '',
    counselingType: '',
  });

  const setFetchParams = useCallback((params: Partial<FetchParams>) => {
    _setFetchParams(prev => ({
      ...prev,
      ...params,
      page: params.page ?? (params.search !== undefined || params.counselingType !== undefined ? 1 : prev.page),
    }));
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const qs = new URLSearchParams();
      qs.set('page', fetchParams.page.toString());
      qs.set('limit', fetchParams.limit.toString());
      if (fetchParams.search) qs.set('search', fetchParams.search);
      if (fetchParams.counselingType) qs.set('counselingType', fetchParams.counselingType);

      const res = await fetch(`/api/counseling?${qs.toString()}`, { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'ไม่สามารถโหลดข้อมูลได้');
      }

      const data = await res.json();
      if (data.success) {
        setRecords(data.data.records);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [fetchParams]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    pagination,
    loading,
    error,
    fetchParams,
    setFetchParams,
    refetch: fetchRecords,
  };
}