// components/CounselingDetail/DetailHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, Pencil, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CounselingDetail } from '@/hooks/useCounselingDetail';

interface DetailHeaderProps {
  record: CounselingDetail;
  isEditing: boolean;
  saving: boolean;
  canEdit: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
}

export function DetailHeader({
  record, isEditing, saving, canEdit,
  onEditToggle, onSave, onCancelEdit,
}: DetailHeaderProps) {
  const dateStr = format(new Date(record.date), 'dd MMMM yyyy', { locale: th });
  const fullName = `${record.patient.prefix ?? ''} ${record.patient.firstName} ${record.patient.lastName}`.trim();

  return (
    <div className="mb-6">
      {/* Back link */}
      <Link
        href="/counseling"
        className="inline-flex items-center gap-1.5 text-sm text-content-secondary hover:text-content-primary transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        กลับรายการ
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-content-primary">{fullName}</h1>
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold',
                record.counselingType === 'PRE'
                  ? 'bg-alert-info-bg border-alert-info-border text-alert-info-text'
                  : 'bg-alert-success-bg border-alert-success-border text-alert-success-text',
              )}
            >
              {record.counselingType === 'PRE' ? 'Pre-CL' : 'Post-CL'}
            </Badge>
          </div>
          <p className="text-content-secondary text-sm">
            HN {record.patient.hn} · {dateStr} · {record.pharmacist.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={saving}
                className="gap-1.5"
              >
                <X className="w-4 h-4" />
                ยกเลิก
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={saving}
                className="gap-1.5 gradient-brand-semantic hover:opacity-90"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
                ) : (
                  <><Save className="w-4 h-4" />บันทึก</>
                )}
              </Button>
            </>
          ) : canEdit ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditToggle}
              className="gap-1.5"
            >
              <Pencil className="w-4 h-4" />
              แก้ไข
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}