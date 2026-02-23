// components/CounselingForm/Section07_LeftoverMeds.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Package } from 'lucide-react';
import type { LeftoverMedItem } from '@/types/counseling';

interface Props {
  leftoverMeds: LeftoverMedItem[];
  onChange: (items: LeftoverMedItem[]) => void;
}

export function Section07_LeftoverMeds({ leftoverMeds, onChange }: Props) {
  const addItem = () => {
    onChange([...leftoverMeds, { drugName: '', quantity: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(leftoverMeds.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LeftoverMedItem, value: string | number) => {
    onChange(leftoverMeds.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            7
          </div>
          ยาเหลือ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        {leftoverMeds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-primary p-4 text-center text-sm text-content-tertiary">
            <Package className="w-6 h-6 mx-auto mb-2 opacity-40" />
            ไม่มียาเหลือ — กดเพิ่มรายการ
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_100px_32px] gap-2 px-1">
              <Label className="text-xs text-content-tertiary">ชื่อยา</Label>
              <Label className="text-xs text-content-tertiary">จำนวน (เม็ด/ชิ้น)</Label>
              <span />
            </div>
            {leftoverMeds.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_100px_32px] gap-2 items-center">
                <Input
                  value={item.drugName}
                  onChange={(e) => updateItem(index, 'drugName', e.target.value)}
                  placeholder="ชื่อยา"
                  className="text-sm"
                />
                <Input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 text-content-tertiary hover:text-alert-error-text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          เพิ่มยาเหลือ
        </Button>
      </CardContent>
    </Card>
  );
}