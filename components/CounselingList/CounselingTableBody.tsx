// components/CounselingList/CounselingTableBody.tsx
'use client';

import React from 'react';
import { EmptyState } from '@/components/shared/EmptyState';
import { CounselingTableRow } from './CounselingTableRow';
import type { CounselingListItem } from '@/hooks/useCounselingList';

interface CounselingTableBodyProps {
  records: CounselingListItem[];
  loading: boolean;
  searchActive: boolean;
  searchTerm: string;
}

function SkeletonRows() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden md:block divide-y divide-border-primary">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[120px_1fr_90px_100px_110px_110px_80px] gap-3 px-4 py-3 animate-pulse"
          >
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-4 bg-surface-interactive rounded" />
            ))}
          </div>
        ))}
      </div>
      {/* Mobile skeleton */}
      <div className="md:hidden divide-y divide-border-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-3 animate-pulse space-y-2">
            <div className="h-4 bg-surface-interactive rounded w-3/4" />
            <div className="h-3 bg-surface-interactive rounded w-1/2" />
          </div>
        ))}
      </div>
    </>
  );
}

export function CounselingTableBody({
  records,
  loading,
  searchActive,
  searchTerm,
}: CounselingTableBodyProps) {
  if (loading) return <SkeletonRows />;

  if (records.length === 0) {
    return (
      <EmptyState
        title="ยังไม่มีบันทึก Counseling"
        description={
          searchActive
            ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"`
            : 'เริ่มต้นบันทึกข้อมูลการให้คำปรึกษาผู้ป่วย'
        }
        action={
          !searchActive
            ? { label: 'บันทึก C/L ใหม่', href: '/counseling/new' }
            : undefined
        }
      />
    );
  }

  return (
    <div>
      {records.map(record => (
        <CounselingTableRow key={record.id} record={record} />
      ))}
    </div>
  );
}