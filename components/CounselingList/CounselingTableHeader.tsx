// components/CounselingList/CounselingTableHeader.tsx

import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const DESKTOP_COLS = ['วันที่', 'ผู้ป่วย', 'ประเภท', 'ADR', 'Compliance', 'หมายเหตุ', 'เภสัชกร'];

export function CounselingTableHeader() {
  return (
    <>
      {/* Desktop column headers */}
      <div className="hidden md:grid md:grid-cols-[120px_1fr_90px_100px_110px_110px_80px] gap-3 px-4 py-3 border-b border-border-primary bg-surface-secondary rounded-t-xl">
        {DESKTOP_COLS.map(h => (
          <span
            key={h}
            className="text-xs font-semibold text-content-secondary uppercase tracking-wide"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Mobile header */}
      <CardHeader className="md:hidden py-3 border-b border-border-primary">
        <CardTitle className="text-sm text-content-secondary font-semibold uppercase tracking-wide">
          รายการ Counseling
        </CardTitle>
      </CardHeader>
    </>
  );
}