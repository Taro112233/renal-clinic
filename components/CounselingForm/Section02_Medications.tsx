// components/CounselingForm/Section02_Medications.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Pill } from 'lucide-react';
import type { SelectOption } from '@/hooks/useSelectOptions';
import { cn } from '@/lib/utils';

interface Props {
  hasDmards: boolean;
  currentDmards: string[];
  otherMeds: string;
  onHasDmardsChange: (v: boolean) => void;
  onCurrentDmardsChange: (v: string[]) => void;
  onOtherMedsChange: (v: string) => void;
  dmardOptions: SelectOption[];
}

export function Section02_Medications({
  hasDmards, currentDmards, otherMeds,
  onHasDmardsChange, onCurrentDmardsChange, onOtherMedsChange,
  dmardOptions,
}: Props) {
  const toggleDmard = (value: string) => {
    if (currentDmards.includes(value)) {
      onCurrentDmardsChange(currentDmards.filter(d => d !== value));
    } else {
      onCurrentDmardsChange([...currentDmards, value]);
    }
  };

  const handleToggle = (v: boolean) => {
    onHasDmardsChange(v);
    if (!v) {
      // ปิด → ล้างยาที่เลือกไว้
      onCurrentDmardsChange([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            2
          </div>
          ข้อมูลยา
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-content-secondary" />
            <Label htmlFor="hasDmards" className="cursor-pointer">ผู้ป่วยได้รับ DMARDs</Label>
          </div>
          <Switch
            id="hasDmards"
            checked={hasDmards}
            onCheckedChange={handleToggle}
          />
        </div>

        {hasDmards && (
          <div className="space-y-2">
            <Label>เลือก DMARDs ที่ผู้ป่วยได้รับ</Label>
            {dmardOptions.length === 0 ? (
              <p className="text-sm text-content-tertiary">ไม่พบตัวเลือก DMARD ในระบบ</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {dmardOptions.map((opt) => {
                  const selected = currentDmards.includes(opt.value);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleDmard(opt.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                        selected
                          ? 'gradient-brand-semantic text-white border-transparent shadow-sm'
                          : 'border-border-primary text-content-secondary hover:bg-surface-interactive hover:border-border-interactive'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
            {currentDmards.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs text-content-tertiary">เลือก:</span>
                {currentDmards.map(d => (
                  <Badge key={d} className="text-xs gradient-brand-semantic text-white border-transparent">
                    {dmardOptions.find(o => o.value === d)?.label ?? d}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="otherMeds">ยาอื่นๆ ที่ได้รับ</Label>
          <Textarea
            id="otherMeds"
            value={otherMeds}
            onChange={(e) => onOtherMedsChange(e.target.value)}
            placeholder="ระบุยาอื่น ๆ ที่ผู้ป่วยได้รับ (ถ้ามี)"
            rows={2}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}