// components/CounselingForm/Section07_LeftoverMeds.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Package, Search, Loader2 } from 'lucide-react';
import type { LeftoverMedItem } from '@/types/counseling';

interface DrugOption {
  id: string;
  drugCode: string;
  drugName: string;
  unitPrice: number;
}

interface Props {
  leftoverMeds: LeftoverMedItem[];
  onChange: (items: LeftoverMedItem[]) => void;
}

function DrugSearchInput({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (drugName: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<DrugOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/drug-master?search=${encodeURIComponent(q.trim())}&limit=10&isActive=true`,
          { credentials: 'include' }
        );
        const json = await res.json();
        if (json.success) {
          setResults(json.data.drugs ?? []);
          setOpen(true);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (drug: DrugOption) => {
    setQuery(drug.drugName);
    setOpen(false);
    setResults([]);
    onSelect(drug.drugName);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary pointer-events-none" />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary animate-spin" />
        )}
        <Input
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="ค้นหายา..."
          className="text-sm pl-8 pr-8"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-secondary border border-border-primary rounded-lg shadow-elevation-3 max-h-52 overflow-y-auto">
          {results.map((drug) => (
            <button
              key={drug.id}
              type="button"
              onMouseDown={() => handleSelect(drug)}
              className="w-full text-left px-3 py-2 hover:bg-surface-interactive transition-colors"
            >
              <p className="text-sm text-content-primary font-medium">{drug.drugName}</p>
              <p className="text-xs text-content-tertiary">{drug.drugCode}</p>
            </button>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.trim() && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-secondary border border-border-primary rounded-lg shadow-elevation-3 px-3 py-2">
          <p className="text-sm text-content-tertiary">ไม่พบยา "{query}"</p>
        </div>
      )}
    </div>
  );
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
              <div key={index} className="grid grid-cols-[1fr_100px_32px] gap-2 items-start">
                <DrugSearchInput
                  value={item.drugName}
                  onSelect={(name) => updateItem(index, 'drugName', name)}
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
                  className="h-9 w-8 text-content-tertiary hover:text-alert-error-text"
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