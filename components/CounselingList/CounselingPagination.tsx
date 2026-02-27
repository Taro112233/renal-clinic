// components/CounselingList/CounselingPagination.tsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CounselingPagination } from '@/hooks/useCounselingList';

interface CounselingPaginationProps {
  pagination: CounselingPagination;
  onPageChange: (page: number) => void;
}

export function CounselingPaginationBar({ pagination, onPageChange }: CounselingPaginationProps) {
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  if (pagination.totalPages <= 1) {
    return (
      <div className="px-4 py-3 border-t border-border-primary">
        <p className="text-xs text-content-secondary">ทั้งหมด {pagination.total} รายการ</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border-primary">
      <p className="text-xs text-content-secondary">
        แสดง {start}–{end} จาก {pagination.total} รายการ
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-content-primary px-2 tabular-nums">
          {pagination.page} / {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}