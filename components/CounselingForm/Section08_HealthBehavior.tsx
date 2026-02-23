// components/CounselingForm/Section08_HealthBehavior.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { SelectOption } from '@/hooks/useSelectOptions';

interface Props {
  alcoholStatus: string;
  herbStatus: string;
  smokingStatus: string;
  nsaidFromOther: string;
  onAlcoholChange: (v: string) => void;
  onHerbChange: (v: string) => void;
  onSmokingChange: (v: string) => void;
  onNsaidChange: (v: string) => void;
  alcoholOptions: SelectOption[];
  herbOptions: SelectOption[];
  smokingOptions: SelectOption[];
}

export function Section08_HealthBehavior({
  alcoholStatus, herbStatus, smokingStatus, nsaidFromOther,
  onAlcoholChange, onHerbChange, onSmokingChange, onNsaidChange,
  alcoholOptions, herbOptions, smokingOptions,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            8
          </div>
          พฤติกรรมสุขภาพ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Alcohol */}
          <div className="space-y-2">
            <Label>สุรา/แอลกอฮอล์</Label>
            <Select value={alcoholStatus} onValueChange={onAlcoholChange}>
              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
              <SelectContent>
                {alcoholOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Herb */}
          <div className="space-y-2">
            <Label>สมุนไพร</Label>
            <Select value={herbStatus} onValueChange={onHerbChange}>
              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
              <SelectContent>
                {herbOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Smoking */}
          <div className="space-y-2">
            <Label>สูบบุหรี่</Label>
            <Select value={smokingStatus} onValueChange={onSmokingChange}>
              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
              <SelectContent>
                {smokingOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* NSAID from other */}
        <div className="space-y-2">
          <Label htmlFor="nsaid">NSAID จากแหล่งอื่น</Label>
          <Input
            id="nsaid"
            value={nsaidFromOther}
            onChange={(e) => onNsaidChange(e.target.value)}
            placeholder="ระบุชื่อยา NSAID ที่ได้รับจากแหล่งอื่น (ถ้ามี)"
          />
        </div>
      </CardContent>
    </Card>
  );
}