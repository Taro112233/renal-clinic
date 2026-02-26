// components/CounselingForm/Section05_EyeScreening.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import type {
  EyeAppointmentStatus, ConsultEyeResult,
  PopupHQAction,
} from '@/types/counseling';
import type { SelectOption } from '@/hooks/useSelectOptions';

const EYE_APPT_OPTIONS: { value: EyeAppointmentStatus; label: string }[] = [
  { value: 'YES', label: 'มีนัด' },
  { value: 'NO', label: 'ไม่มีนัด' },
  { value: 'LOSS', label: 'ขาดนัด' },
  { value: 'EXTERNAL_SCREENING', label: 'ตรวจภายนอก' },
];

const CONSULT_EYE_OPTIONS: { value: ConsultEyeResult; label: string }[] = [
  { value: 'YES', label: 'Consult แล้ว' },
  { value: 'NO', label: 'ยังไม่ Consult' },
  { value: 'NOT_SUGGESTED', label: 'ไม่จำเป็น' },
];

const POPUP_HQ_OPTIONS: { value: PopupHQAction; label: string }[] = [
  { value: 'NONE', label: 'ไม่มีการเปลี่ยนแปลง' },
  { value: 'SET_NEW', label: 'ตั้งวันนัดใหม่' },
  { value: 'UPDATE', label: 'อัปเดตวันนัด' },
  { value: 'EXISTING', label: 'ใช้วันนัดเดิม' },
];

interface Props {
  hasHQ: boolean;
  eyeScreeningStatus: string;
  eyeAppointmentStatus: EyeAppointmentStatus | '';
  consultEyeResult: ConsultEyeResult | '';
  prevEyeDate: string;
  eyeResult: string;
  nextEyeDate: string;
  popupHQAction: PopupHQAction | '';
  onHasHQChange: (v: boolean) => void;
  onEyeScreeningStatusChange: (v: string) => void;
  onEyeAppointmentStatusChange: (v: EyeAppointmentStatus | '') => void;
  onConsultEyeResultChange: (v: ConsultEyeResult | '') => void;
  onPrevEyeDateChange: (v: string) => void;
  onEyeResultChange: (v: string) => void;
  onNextEyeDateChange: (v: string) => void;
  onPopupHQActionChange: (v: PopupHQAction | '') => void;
  eyeScreeningStatusOptions: SelectOption[];
  eyeResultOptions: SelectOption[];
}

export function Section05_EyeScreening({
  hasHQ, eyeScreeningStatus, eyeAppointmentStatus,
  consultEyeResult, prevEyeDate, eyeResult, nextEyeDate, popupHQAction,
  onHasHQChange, onEyeScreeningStatusChange, onEyeAppointmentStatusChange,
  onConsultEyeResultChange, onPrevEyeDateChange, onEyeResultChange,
  onNextEyeDateChange, onPopupHQActionChange,
  eyeScreeningStatusOptions, eyeResultOptions,
}: Props) {

  const handleToggle = (v: boolean) => {
    onHasHQChange(v);
    if (!v) {
      // ปิด → ล้างทุก eye field
      onEyeScreeningStatusChange('');
      onEyeAppointmentStatusChange('');
      onConsultEyeResultChange('');
      onPrevEyeDateChange('');
      onEyeResultChange('');
      onNextEyeDateChange('');
      onPopupHQActionChange('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            5
          </div>
          HQ/CQ Eye Screening
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-content-secondary" />
            <Label htmlFor="hasHQ" className="cursor-pointer">ผู้ป่วยได้รับ HQ/CQ</Label>
          </div>
          <Switch id="hasHQ" checked={hasHQ} onCheckedChange={handleToggle} />
        </div>

        {hasHQ && (
          <div className="space-y-4 pl-1 border-l-2 border-border-interactive">
            <div className="pl-3 space-y-4">

              {eyeScreeningStatusOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>สถานะการตรวจตา</Label>
                  <Select value={eyeScreeningStatus} onValueChange={onEyeScreeningStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      {eyeScreeningStatusOptions.map(opt => (
                        <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>สถานะนัด Eye</Label>
                  <Select
                    value={eyeAppointmentStatus}
                    onValueChange={(v) => onEyeAppointmentStatusChange(v as EyeAppointmentStatus)}
                  >
                    <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                    <SelectContent>
                      {EYE_APPT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ผลการ Consult จักษุ</Label>
                  <Select
                    value={consultEyeResult}
                    onValueChange={(v) => onConsultEyeResultChange(v as ConsultEyeResult)}
                  >
                    <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                    <SelectContent>
                      {CONSULT_EYE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prevEyeDate">วันที่ตรวจตาครั้งล่าสุด</Label>
                  <Input
                    id="prevEyeDate"
                    type="date"
                    value={prevEyeDate}
                    onChange={(e) => onPrevEyeDateChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextEyeDate">วันนัดตรวจตาครั้งถัดไป</Label>
                  <Input
                    id="nextEyeDate"
                    type="date"
                    value={nextEyeDate}
                    onChange={(e) => onNextEyeDateChange(e.target.value)}
                  />
                </div>
              </div>

              {eyeResultOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>ผลการตรวจตา</Label>
                  <Select value={eyeResult} onValueChange={onEyeResultChange}>
                    <SelectTrigger><SelectValue placeholder="เลือกผล" /></SelectTrigger>
                    <SelectContent>
                      {eyeResultOptions.map(opt => (
                        <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>POP-HQ Action</Label>
                <Select
                  value={popupHQAction}
                  onValueChange={(v) => onPopupHQActionChange(v as PopupHQAction)}
                >
                  <SelectTrigger><SelectValue placeholder="เลือก Action" /></SelectTrigger>
                  <SelectContent>
                    {POPUP_HQ_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}