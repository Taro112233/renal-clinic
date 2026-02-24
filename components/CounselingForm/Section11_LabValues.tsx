// components/CounselingForm/Section11_LabValues.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

interface LabField {
  key: string;
  label: string;
  unit: string;
}

const LAB_FIELDS: LabField[] = [
  { key: 'wbc', label: 'WBC', unit: '×10³/µL' },
  { key: 'absoluteNeutrophil', label: 'ANC', unit: '×10³/µL' },
  { key: 'neutrophilPercent', label: 'Neutrophil %', unit: '%' },
  { key: 'ast', label: 'AST', unit: 'U/L' },
  { key: 'alt', label: 'ALT', unit: 'U/L' },
  { key: 'alp', label: 'ALP', unit: 'U/L' },
  { key: 'uricAcid', label: 'Uric Acid', unit: 'mg/dL' },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL' },
  { key: 'albumin', label: 'Albumin', unit: 'g/dL' },
  { key: 'hsCRP', label: 'hs-CRP', unit: 'mg/L' },
];

interface Props {
  labDate: string;
  labValues: Record<string, string>;
  labLevel: string;
  onLabDateChange: (v: string) => void;
  onLabValueChange: (key: string, v: string) => void;
  onLabLevelChange: (v: string) => void;
}

export function Section11_LabValues({
  labDate, labValues, labLevel,
  onLabDateChange, onLabValueChange, onLabLevelChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const hasAnyLab = labDate || Object.values(labValues).some(v => v !== '');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
              11
            </div>
            ค่า Lab
            {hasAnyLab && (
              <span className="text-xs text-alert-info-text bg-alert-info-bg border border-alert-info-border rounded-full px-2 py-0.5 font-normal">
                มีข้อมูล
              </span>
            )}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(v => !v)}
            className="gap-1 text-content-secondary"
          >
            <FlaskConical className="w-4 h-4" />
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labDate">วันที่เจาะเลือด</Label>
              <Input
                id="labDate"
                type="date"
                value={labDate}
                onChange={(e) => onLabDateChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labLevel">Lab Level</Label>
              <Input
                id="labLevel"
                value={labLevel}
                onChange={(e) => onLabLevelChange(e.target.value)}
                placeholder="ระดับ Lab (ถ้ามี)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {LAB_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-xs">
                  {field.label}
                  <span className="text-content-tertiary ml-1">({field.unit})</span>
                </Label>
                <Input
                  id={field.key}
                  type="number"
                  step="0.01"
                  value={labValues[field.key] ?? ''}
                  onChange={(e) => onLabValueChange(field.key, e.target.value)}
                  placeholder="—"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}