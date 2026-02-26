// components/CounselingForm/Section06_Compliance.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { ComplianceStatus, NonComplianceType, NonComplianceItemForm } from '@/types/counseling';
import { cn } from '@/lib/utils';

const COMPLIANCE_OPTIONS: { value: ComplianceStatus; label: string; color: string }[] = [
  { value: 'COMPLIANT', label: 'ใช้ยาถูกต้อง', color: 'success' },
  { value: 'NON_COMPLIANT', label: 'ไม่ compliance', color: 'error' },
  { value: 'UNABLE_TO_ASSESS', label: 'ประเมินไม่ได้', color: 'warning' },
];

const NC_TYPE_OPTIONS: { value: NonComplianceType; label: string }[] = [
  { value: 'WRONG_METHOD', label: 'วิธีการใช้ยาผิด' },
  { value: 'FORGOT_DOSE', label: 'ลืมกินยา' },
  { value: 'SELF_ADJUST', label: 'ปรับขนาดยาเอง' },
  { value: 'LOSS_FOLLOWUP', label: 'ขาดนัด' },
  { value: 'STOPPED_DUE_TO_ADR', label: 'หยุดยาจาก ADR' },
];

interface Props {
  complianceStatus: ComplianceStatus;
  nonComplianceItems: NonComplianceItemForm[];
  onComplianceStatusChange: (v: ComplianceStatus) => void;
  onNonComplianceItemsChange: (items: NonComplianceItemForm[]) => void;
  error?: string;
}

export function Section06_Compliance({
  complianceStatus, nonComplianceItems,
  onComplianceStatusChange, onNonComplianceItemsChange,
  error,
}: Props) {

  const handleStatusChange = (v: ComplianceStatus) => {
    onComplianceStatusChange(v);
    // เปลี่ยนออกจาก NON_COMPLIANT → ล้างรายการ
    if (v !== 'NON_COMPLIANT') {
      onNonComplianceItemsChange([]);
    }
  };

  const addItem = () => {
    if (nonComplianceItems.length >= 3) return;
    onNonComplianceItemsChange([
      ...nonComplianceItems,
      { orderNumber: nonComplianceItems.length + 1, type: '', description: '' },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = nonComplianceItems
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, orderNumber: i + 1 }));
    onNonComplianceItemsChange(updated);
  };

  const updateItem = (index: number, field: 'type' | 'description', value: string) => {
    const updated = nonComplianceItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onNonComplianceItemsChange(updated);
  };

  const isNonCompliant = complianceStatus === 'NON_COMPLIANT';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            6
          </div>
          Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-2">
          <Label>สถานะการใช้ยา *</Label>
          <div className="grid grid-cols-3 gap-2">
            {COMPLIANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={cn(
                  'py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                  complianceStatus === opt.value
                    ? opt.color === 'success'
                      ? 'bg-alert-success-bg text-alert-success-text border-alert-success-border'
                      : opt.color === 'error'
                        ? 'bg-alert-error-bg text-alert-error-text border-alert-error-border'
                        : 'bg-alert-warning-bg text-alert-warning-text border-alert-warning-border'
                    : 'border-border-primary text-content-secondary hover:bg-surface-interactive'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-alert-error-text">{error}</p>}
        </div>

        {isNonCompliant && (
          <div className="space-y-3 pl-1 border-l-2 border-alert-error-border">
            <div className="pl-3 space-y-3">
              <Label className="text-sm text-content-secondary">รายการปัญหา non-compliance (สูงสุด 3 รายการ)</Label>

              {nonComplianceItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2 bg-surface-secondary rounded-lg p-3">
                  <span className="text-xs text-content-tertiary font-medium mt-2.5 w-4 shrink-0">
                    {item.orderNumber}.
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select
                      value={item.type}
                      onValueChange={(v) => updateItem(index, 'type', v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="ประเภทปัญหา" />
                      </SelectTrigger>
                      <SelectContent>
                        {NC_TYPE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.description ?? ''}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="รายละเอียดเพิ่มเติม"
                      className="text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 text-content-tertiary hover:text-alert-error-text shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              {nonComplianceItems.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่มรายการ
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}