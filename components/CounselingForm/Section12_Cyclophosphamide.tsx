// components/CounselingForm/Section12_Cyclophosphamide.tsx
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
import { Syringe } from 'lucide-react';
import type { CyclophosphamideRoute } from '@/types/counseling';

interface Props {
  hasCyclophosphamide: boolean;
  cyclophosphamideRoute: CyclophosphamideRoute | '';
  cyclophosphamideCumulativeDose: string;
  onHasCYCChange: (v: boolean) => void;
  onRouteChange: (v: CyclophosphamideRoute | '') => void;
  onCumulativeDoseChange: (v: string) => void;
}

export function Section12_Cyclophosphamide({
  hasCyclophosphamide, cyclophosphamideRoute, cyclophosphamideCumulativeDose,
  onHasCYCChange, onRouteChange, onCumulativeDoseChange,
}: Props) {

  const handleToggle = (v: boolean) => {
    onHasCYCChange(v);
    if (!v) {
      // ปิด → ล้าง route และ dose
      onRouteChange('');
      onCumulativeDoseChange('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            12
          </div>
          Cyclophosphamide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-content-secondary" />
            <Label htmlFor="hasCYC" className="cursor-pointer">ผู้ป่วยได้รับ Cyclophosphamide</Label>
          </div>
          <Switch id="hasCYC" checked={hasCyclophosphamide} onCheckedChange={handleToggle} />
        </div>

        {hasCyclophosphamide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-l-2 border-border-interactive pl-3 ml-1">
            <div className="space-y-2">
              <Label>วิธีบริหารยา</Label>
              <Select
                value={cyclophosphamideRoute}
                onValueChange={(v) => onRouteChange(v as CyclophosphamideRoute)}
              >
                <SelectTrigger><SelectValue placeholder="เลือกวิธี" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORAL">Oral (รับประทาน)</SelectItem>
                  <SelectItem value="IV">IV (ฉีดเข้าหลอดเลือด)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cumulativeDose">Cumulative Dose (mg)</Label>
              <Input
                id="cumulativeDose"
                type="number"
                step="1"
                min={0}
                value={cyclophosphamideCumulativeDose}
                onChange={(e) => onCumulativeDoseChange(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}