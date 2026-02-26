// components/CounselingForm/Section10_Other.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import type { SelectOption } from '@/hooks/useSelectOptions';

const ME_LEVELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

interface Props {
  contraceptionMethod: string;
  hasME: boolean;
  meType: string;
  meDescription: string;
  meLevel: string;
  onContraceptionChange: (v: string) => void;
  onHasMEChange: (v: boolean) => void;
  onMeTypeChange: (v: string) => void;
  onMeDescriptionChange: (v: string) => void;
  onMeLevelChange: (v: string) => void;
  contraceptionOptions: SelectOption[];
  meTypeOptions: SelectOption[];
}

export function Section10_Other({
  contraceptionMethod, hasME, meType, meDescription, meLevel,
  onContraceptionChange, onHasMEChange, onMeTypeChange,
  onMeDescriptionChange, onMeLevelChange,
  contraceptionOptions, meTypeOptions,
}: Props) {

  const handleToggle = (v: boolean) => {
    onHasMEChange(v);
    if (!v) {
      // ปิด → ล้างข้อมูล ME ทั้งหมด
      onMeTypeChange('');
      onMeDescriptionChange('');
      onMeLevelChange('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            10
          </div>
          อื่นๆ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {contraceptionOptions.length > 0 && (
          <div className="space-y-2">
            <Label>วิธีคุมกำเนิด</Label>
            <Select value={contraceptionMethod} onValueChange={onContraceptionChange}>
              <SelectTrigger><SelectValue placeholder="เลือกวิธีคุมกำเนิด (ถ้ามี)" /></SelectTrigger>
              <SelectContent>
                {contraceptionOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-content-secondary" />
              <Label htmlFor="hasME" className="cursor-pointer">พบ Medication Error (ME)</Label>
            </div>
            <Switch id="hasME" checked={hasME} onCheckedChange={handleToggle} />
          </div>

          {hasME && (
            <div className="space-y-3 pl-1 border-l-2 border-alert-warning-border">
              <div className="pl-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {meTypeOptions.length > 0 && (
                    <div className="space-y-2">
                      <Label>ประเภท ME</Label>
                      <Select value={meType} onValueChange={onMeTypeChange}>
                        <SelectTrigger><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                        <SelectContent>
                          {meTypeOptions.map(opt => (
                            <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>ระดับ ME (NCC MERP)</Label>
                    <Select value={meLevel} onValueChange={onMeLevelChange}>
                      <SelectTrigger><SelectValue placeholder="ระดับ A–G" /></SelectTrigger>
                      <SelectContent>
                        {ME_LEVELS.map(lv => (
                          <SelectItem key={lv} value={lv}>ระดับ {lv}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meDescription">รายละเอียด ME</Label>
                  <Textarea
                    id="meDescription"
                    value={meDescription}
                    onChange={(e) => onMeDescriptionChange(e.target.value)}
                    placeholder="อธิบายรายละเอียด Medication Error..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}