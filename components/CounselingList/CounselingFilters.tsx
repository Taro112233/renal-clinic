// components/CounselingList/CounselingFilters.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CounselingType } from '@/types/counseling';

interface CounselingFiltersProps {
  counselingType: CounselingType | '';
  limit: number;
  loading: boolean;
  onSearch: (search: string) => void;
  onTypeChange: (type: CounselingType | '') => void;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
}

export function CounselingFilters({
  counselingType,
  limit,
  loading,
  onSearch,
  onTypeChange,
  onLimitChange,
  onRefresh,
}: CounselingFiltersProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = useCallback(() => {
    onSearch(searchInput);
  }, [searchInput, onSearch]);

  const handleClear = useCallback(() => {
    setSearchInput('');
    onSearch('');
  }, [onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
            <Input
              placeholder="ค้นหา HN, ชื่อ, นามสกุล..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-9"
            />
            {searchInput && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button variant="outline" onClick={handleSearch} className="gap-2 sm:w-auto w-full">
            <SlidersHorizontal className="w-4 h-4" />
            ค้นหา
          </Button>

          {/* Type filter */}
          <Select
            value={counselingType || 'all'}
            onValueChange={v => onTypeChange(v === 'all' ? '' : (v as CounselingType))}
          >
            <SelectTrigger className="sm:w-36 w-full">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="PRE">Pre-CL</SelectItem>
              <SelectItem value="POST">Post-CL</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit filter */}
          <Select
            value={limit.toString()}
            onValueChange={v => onLimitChange(parseInt(v))}
          >
            <SelectTrigger className="sm:w-28 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / หน้า</SelectItem>
              <SelectItem value="20">20 / หน้า</SelectItem>
              <SelectItem value="50">50 / หน้า</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
            title="รีเฟรช"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}