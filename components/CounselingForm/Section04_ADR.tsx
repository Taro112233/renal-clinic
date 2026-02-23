// components/CounselingForm/Section04_ADR.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import type { AdrStatus } from '@/types/counseling';

const ADR_OPTIONS: { value: AdrStatus; label: string }[] = [
  { value: 'NO', label: 'ไม่พบ ADR' },
  { value: 'YES_DMARD', label: 'พบ ADR จาก DMARD' },
  { value: 'YES_HQ', label: 'พบ ADR จาก HQ/CQ' },
  { value: 'YES_OTHER', label: 'พบ ADR จากยาอื่น' },
  { value: 'YES_DMARD_HQ', label: 'พบ ADR จาก DMARD + HQ/CQ' },
  { value: 'YES_DMARD_OTHER', label: 'พบ ADR จาก DMARD + ยาอื่น' },
];

interface Props {
  adrStatus: AdrStatus;
  adrDescription: string;
  onAdrStatusChange: (v: AdrStatus) => void;
  onAdrDescriptionChange: (v: string) => void;
  error?: string;
}

export function Section04_ADR({
  adrStatus, adrDescription,
  onAdrStatusChange, onAdrDescriptionChange,
  error,
}: Props) {
  const hasAdr = adrStatus !== 'NO';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            4
          </div>
          ADR Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>สถานะ ADR *</Label>
          <Select value={adrStatus} onValueChange={(v) => onAdrStatusChange(v as AdrStatus)}>
            <SelectTrigger className={error ? 'border-alert-error-border' : ''}>
              <SelectValue placeholder="เลือกสถานะ ADR" />
            </SelectTrigger>
            <SelectContent>
              {ADR_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    {opt.value !== 'NO' && <AlertTriangle className="w-3 h-3 text-alert-warning-icon" />}
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-alert-error-text">{error}</p>}
        </div>

        {hasAdr && (
          <div className="space-y-2">
            <Label htmlFor="adrDescription">รายละเอียด ADR</Label>
            <Textarea
              id="adrDescription"
              value={adrDescription}
              onChange={(e) => onAdrDescriptionChange(e.target.value)}
              placeholder="ระบุรายละเอียด ADR ที่พบ..."
              rows={3}
              className="resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}