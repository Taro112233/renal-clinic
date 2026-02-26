// components/CounselingForm/Section08_HealthBehavior.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, ChevronDown, X, Check } from 'lucide-react';
import type { SelectOption } from '@/hooks/useSelectOptions';
import { cn } from '@/lib/utils';

const NO_VALUE = 'NO';

interface MultiSelectDropdownProps {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
}

function MultiSelectDropdown({
  label, values, onChange, options, placeholder = 'เลือก...',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isNo = values.length === 0 || values.includes(NO_VALUE);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (value: string) => {
    if (value === NO_VALUE) {
      onChange([]);
      return;
    }
    const withoutNo = values.filter(v => v !== NO_VALUE);
    if (withoutNo.includes(value)) {
      onChange(withoutNo.filter(v => v !== value));
    } else {
      onChange([...withoutNo, value]);
    }
  };

  const removeTag = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== value));
  };

  const getLabelForValue = (val: string) =>
    options.find(o => o.value === val)?.label ?? val;

  const displayValues = values.filter(v => v !== NO_VALUE);

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div ref={ref} className="relative">

        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className={cn(
            'w-full min-h-9.5 px-3 py-1.5 rounded-md border text-sm text-left',
            'flex items-center gap-1.5 flex-wrap',
            'bg-input border-border hover:border-border-interactive transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
            open && 'border-border-interactive ring-2 ring-ring'
          )}
        >
          {displayValues.length === 0 ? (
            <span className="text-muted-foreground flex-1">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1 flex-1">
              {displayValues.map(val => (
                <Badge
                  key={val}
                  className="text-xs gradient-brand-semantic text-white border-transparent gap-1 pr-1 font-normal"
                >
                  {getLabelForValue(val)}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeTag(val, e)}
                    onKeyDown={(e) => e.key === 'Enter' && removeTag(val, e as unknown as React.MouseEvent)}
                    className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </span>
                </Badge>
              ))}
            </div>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground shrink-0 transition-transform ml-auto',
              open && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-md border border-border bg-popover shadow-elevation-2 overflow-hidden">
            <div className="max-h-52 overflow-y-auto py-1">

              {/* NO option */}
              <button
                type="button"
                onClick={() => { toggle(NO_VALUE); setOpen(false); }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                  isNo && 'bg-accent/50 text-content-primary font-medium'
                )}
              >
                <span>ไม่มี</span>
                {isNo && <Check className="w-3.5 h-3.5 text-brand-primary" />}
              </button>

              {options.length > 0 && (
                <div className="border-t border-border-subtle mx-1 my-1" />
              )}

              {options.map(opt => {
                const selected = displayValues.includes(opt.value);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                      selected && 'bg-accent/50 text-content-primary font-medium'
                    )}
                  >
                    <span>{opt.label}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                  </button>
                );
              })}

              {options.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">ไม่พบตัวเลือกในระบบ</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  alcoholStatus: string[];
  herbStatus: string[];
  smokingStatus: string[];
  nsaidFromOther: string;
  onAlcoholChange: (v: string[]) => void;
  onHerbChange: (v: string[]) => void;
  onSmokingChange: (v: string[]) => void;
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

        <div className="flex items-center gap-2 text-xs text-content-tertiary">
          <Heart className="w-3.5 h-3.5" />
          <span>เลือกได้หลายรายการ — เลือก &ldquo;ไม่มี&rdquo; เพื่อล้างทั้งหมด</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MultiSelectDropdown
            label="แอลกอฮอล์"
            values={alcoholStatus}
            onChange={onAlcoholChange}
            options={alcoholOptions}
            placeholder="เลือกแอลกอฮอล์..."
          />
          <MultiSelectDropdown
            label="สมุนไพร / ยาชุด"
            values={herbStatus}
            onChange={onHerbChange}
            options={herbOptions}
            placeholder="เลือกสมุนไพร..."
          />
          <MultiSelectDropdown
            label="การสูบบุหรี่"
            values={smokingStatus}
            onChange={onSmokingChange}
            options={smokingOptions}
            placeholder="เลือกสถานะ..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nsaidFromOther">NSAIDs จากแหล่งอื่น</Label>
          <Input
            id="nsaidFromOther"
            value={nsaidFromOther}
            onChange={(e) => onNsaidChange(e.target.value)}
            placeholder="ระบุชื่อยา NSAIDs ที่ได้รับจากนอกโรงพยาบาล (ถ้ามี)"
          />
        </div>

      </CardContent>
    </Card>
  );
}