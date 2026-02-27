// components/CounselingList/CounselingTableRow.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, XCircle, Pill, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CounselingListItem } from '@/hooks/useCounselingList';
import type { CounselingType } from '@/types/counseling';

// ─── Sub-badges ───────────────────────────────────────────────────────────

function CounselingTypeBadge({ type }: { type: CounselingType }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-semibold',
        type === 'PRE'
          ? 'bg-alert-info-bg border-alert-info-border text-alert-info-text'
          : 'bg-alert-success-bg border-alert-success-border text-alert-success-text',
      )}
    >
      {type === 'PRE' ? 'Pre-CL' : 'Post-CL'}
    </Badge>
  );
}

const ADR_META: Record<string, { label: string; className: string }> = {
  NO:              { label: '—',            className: 'text-content-tertiary' },
  YES_DMARD:       { label: 'ADR-DMARD',    className: 'text-alert-warning-text' },
  YES_HQ:          { label: 'ADR-HQ',       className: 'text-alert-warning-text' },
  YES_OTHER:       { label: 'ADR-อื่น',     className: 'text-alert-warning-text' },
  YES_DMARD_HQ:    { label: 'ADR-DMARD+HQ', className: 'text-alert-error-text' },
  YES_DMARD_OTHER: { label: 'ADR-DMARD+อื่น', className: 'text-alert-error-text' },
};

function AdrCell({ status }: { status: string }) {
  const meta = ADR_META[status] ?? { label: status, className: 'text-content-secondary' };
  if (status === 'NO') return <span className="text-xs text-content-tertiary">—</span>;
  return (
    <span className={cn('text-xs font-medium flex items-center gap-1', meta.className)}>
      <AlertCircle className="w-3 h-3 shrink-0" />
      {meta.label}
    </span>
  );
}

function ComplianceCell({ status }: { status: string }) {
  if (status === 'COMPLIANT') {
    return (
      <span className="text-xs font-medium flex items-center gap-1 text-alert-success-text">
        <CheckCircle2 className="w-3 h-3" /> ดี
      </span>
    );
  }
  if (status === 'NON_COMPLIANT') {
    return (
      <span className="text-xs font-medium flex items-center gap-1 text-alert-error-text">
        <XCircle className="w-3 h-3" /> ไม่ดี
      </span>
    );
  }
  return <span className="text-xs text-content-tertiary">ประเมินไม่ได้</span>;
}

function FlagsCell({ record }: { record: CounselingListItem }) {
  return (
    <div className="flex items-center gap-2 text-content-tertiary">
      {record.hasDrp && (
        <span title="มี DRP">
          <ClipboardList className="w-4 h-4 text-alert-info-icon" />
        </span>
      )}
      {record.hasCyclophosphamide && (
        <span title="ได้รับ Cyclophosphamide">
          <Pill className="w-4 h-4 text-alert-warning-icon" />
        </span>
      )}
      {record.nonComplianceItems.length > 0 && (
        <span
          title={`Non-compliance ${record.nonComplianceItems.length} รายการ`}
          className="text-xs text-alert-error-text font-semibold"
        >
          NC{record.nonComplianceItems.length}
        </span>
      )}
      {!record.hasDrp && !record.hasCyclophosphamide && record.nonComplianceItems.length === 0 && (
        <span className="text-content-tertiary text-xs">—</span>
      )}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────

export function CounselingTableRow({ record }: { record: CounselingListItem }) {
  const dateStr = format(new Date(record.date), 'dd MMM yy', { locale: th });
  const fullName = `${record.patient.firstName} ${record.patient.lastName}`;

  return (
    <Link href={`/counseling/${record.id}`} className="block group">
      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[120px_1fr_90px_100px_110px_110px_80px] gap-3 px-4 py-3 items-center border-b border-border-primary group-hover:bg-surface-interactive transition-colors last:border-0">
        <span className="text-sm text-content-primary font-medium">{dateStr}</span>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-content-primary truncate">{fullName}</p>
          <p className="text-xs text-content-secondary">HN {record.patient.hn}</p>
        </div>

        <CounselingTypeBadge type={record.counselingType} />
        <AdrCell status={record.adrStatus} />
        <ComplianceCell status={record.complianceStatus} />
        <FlagsCell record={record} />

        <p className="text-xs text-content-secondary truncate">{record.pharmacist.name}</p>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-4 py-3 border-b border-border-primary group-hover:bg-surface-interactive transition-colors last:border-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <p className="text-sm font-semibold text-content-primary">{fullName}</p>
            <p className="text-xs text-content-secondary">HN {record.patient.hn} · {dateStr}</p>
          </div>
          <CounselingTypeBadge type={record.counselingType} />
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <AdrCell status={record.adrStatus} />
          <ComplianceCell status={record.complianceStatus} />
          <FlagsCell record={record} />
        </div>
        <p className="text-xs text-content-tertiary mt-1.5">{record.pharmacist.name}</p>
      </div>
    </Link>
  );
}