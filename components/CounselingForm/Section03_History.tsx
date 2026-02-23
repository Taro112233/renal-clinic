// components/CounselingForm/Section03_History.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList } from 'lucide-react';

interface Props {
  historyNote: string;
  onChange: (v: string) => void;
}

export function Section03_History({ historyNote, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            3
          </div>
          ซักประวัติ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="historyNote">
            <ClipboardList className="w-4 h-4 inline mr-1" />
            บันทึกการซักประวัติ
          </Label>
          <Textarea
            id="historyNote"
            value={historyNote}
            onChange={(e) => onChange(e.target.value)}
            placeholder="บันทึกประวัติที่ซักได้จากผู้ป่วย..."
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}