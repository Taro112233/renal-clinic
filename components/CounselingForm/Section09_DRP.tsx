// components/CounselingForm/Section09_DRP.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Stethoscope } from 'lucide-react';
import type { DrpItemForm } from '@/types/counseling';
import type { SelectOption } from '@/hooks/useSelectOptions';

const CONSULT_RESULT_OPTIONS = [
  { value: 'ACCEPT', label: 'ยอมรับ' },
  { value: 'NOT_ACCEPT', label: 'ไม่ยอมรับ' },
  { value: 'PENDING', label: 'รอผล' },
];

interface Props {
  hasDrp: boolean;
  drpItems: DrpItemForm[];
  onHasDrpChange: (v: boolean) => void;
  onDrpItemsChange: (items: DrpItemForm[]) => void;
  drpTypeOptions: SelectOption[];
}

export function Section09_DRP({
  hasDrp, drpItems,
  onHasDrpChange, onDrpItemsChange,
  drpTypeOptions,
}: Props) {

  const handleToggle = (v: boolean) => {
    onHasDrpChange(v);
    if (!v) {
      // ปิด → ล้างรายการ DRP ทั้งหมด
      onDrpItemsChange([]);
    }
  };

  const addItem = () => {
    if (drpItems.length >= 2) return;
    onDrpItemsChange([
      ...drpItems,
      { orderNumber: drpItems.length + 1, drugName: '', drpType: '', consultResult: '' },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = drpItems
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, orderNumber: i + 1 }));
    onDrpItemsChange(updated);
  };

  const updateItem = (index: number, field: keyof DrpItemForm, value: string) => {
    onDrpItemsChange(drpItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            9
          </div>
          DRP / Consult
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-content-secondary" />
            <Label htmlFor="hasDrp" className="cursor-pointer">พบ DRP / ส่ง Consult</Label>
          </div>
          <Switch id="hasDrp" checked={hasDrp} onCheckedChange={handleToggle} />
        </div>

        {hasDrp && (
          <div className="space-y-3 pl-1 border-l-2 border-border-interactive">
            <div className="pl-3 space-y-3">
              <Label className="text-sm text-content-secondary">รายการ DRP (สูงสุด 2 รายการ)</Label>

              {drpItems.map((item, index) => (
                <div key={index} className="bg-surface-secondary rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-content-tertiary">รายการที่ {item.orderNumber}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="h-7 w-7 text-content-tertiary hover:text-alert-error-text"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={item.drugName}
                      onChange={(e) => updateItem(index, 'drugName', e.target.value)}
                      placeholder="ชื่อยา"
                      className="text-sm"
                    />
                    <Input
                      value={item.drugCode ?? ''}
                      onChange={(e) => updateItem(index, 'drugCode', e.target.value)}
                      placeholder="รหัสยา (ถ้ามี)"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select
                      value={item.drpType}
                      onValueChange={(v) => updateItem(index, 'drpType', v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="ประเภท DRP" />
                      </SelectTrigger>
                      <SelectContent>
                        {drpTypeOptions.map(opt => (
                          <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={item.consultResult ?? ''}
                      onValueChange={(v) => updateItem(index, 'consultResult', v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="ผล Consult" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSULT_RESULT_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              {drpItems.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่ม DRP
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}