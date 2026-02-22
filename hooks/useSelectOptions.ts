// hooks/useSelectOptions.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface SelectOption {
  id: string;
  category: string;
  value: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type GroupedOptions = Record<string, SelectOption[]>;

interface CreatePayload {
  category: string;
  value: string;
  label: string;
  sortOrder: number;
}

interface UpdatePayload {
  label?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export function useSelectOptions() {
  const [data, setData] = useState<GroupedOptions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/settings/select-options', { credentials: 'include' });
      const json = await res.json();
      if (json.success) setData(json.data);
      else throw new Error(json.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOptions(); }, [fetchOptions]);

  const createOption = async (payload: CreatePayload): Promise<boolean> => {
    try {
      setIsMutating(true);
      const res = await fetch('/api/settings/select-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchOptions();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'สร้างตัวเลือกไม่สำเร็จ');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const updateOption = async (id: string, payload: UpdatePayload): Promise<boolean> => {
    try {
      setIsMutating(true);
      const res = await fetch(`/api/settings/select-options/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      // Optimistic update
      setData(prev => {
        const updated = { ...prev };
        for (const cat of Object.keys(updated)) {
          updated[cat] = updated[cat].map(o => o.id === id ? { ...o, ...payload } : o);
        }
        return updated;
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'แก้ไขไม่สำเร็จ');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteOption = async (id: string): Promise<boolean> => {
    try {
      setIsMutating(true);
      const res = await fetch(`/api/settings/select-options/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(prev => {
        const updated = { ...prev };
        for (const cat of Object.keys(updated)) {
          updated[cat] = updated[cat].filter(o => o.id !== id);
        }
        return updated;
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'ลบไม่สำเร็จ');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const categories = Object.keys(data).sort();

  return {
    data,
    categories,
    loading,
    error,
    isMutating,
    refetch: fetchOptions,
    createOption,
    updateOption,
    deleteOption,
  };
}