// components/CounselingForm/SectionNote.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote } from 'lucide-react';

interface Props {
  note: string;
  onChange: (v: string) => void;
}

export function SectionNote({ note, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <StickyNote className="w-4 h-4" />
          หมายเหตุเพิ่มเติม
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="note">บันทึกเพิ่มเติม</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => onChange(e.target.value)}
            placeholder="บันทึกข้อมูลอื่นๆ ที่ต้องการ..."
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}