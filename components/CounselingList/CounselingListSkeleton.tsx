// components/CounselingList/CounselingListSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CounselingListSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            {/* Table header */}
            <div className="border-b border-border-primary px-4 py-3 grid grid-cols-6 gap-4">
              {['วันที่', 'HN / ผู้ป่วย', 'ประเภท', 'ADR', 'Compliance', 'เภสัชกร'].map(h => (
                <Skeleton key={h} className="h-4 w-full" />
              ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-border-primary px-4 py-3 grid grid-cols-6 gap-4 last:border-0">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}