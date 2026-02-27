// components/CounselingList/index.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useCounselingList } from '@/hooks/useCounselingList';
import { CounselingFilters } from './CounselingFilters';
import { CounselingTableHeader } from './CounselingTableHeader';
import { CounselingTableBody } from './CounselingTableBody';
import { CounselingPaginationBar } from './CounselingPagination';
import type { CounselingType } from '@/types/counseling';

export function CounselingList() {
  const {
    records, pagination, loading, error,
    fetchParams, setFetchParams, refetch,
  } = useCounselingList();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-2xl font-bold text-content-primary mb-1">รายการ Counseling</h1>
            <p className="text-content-secondary text-sm">
              บันทึกการให้คำปรึกษาผู้ป่วยคลินิกโรคข้อรูมาติซัมทั้งหมด
            </p>
          </div>
          <Link href="/counseling/new">
            <Button className="gradient-brand-semantic hover:opacity-90 gap-2">
              <Plus className="w-4 h-4" />
              บันทึก C/L ใหม่
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <CounselingFilters
            counselingType={fetchParams.counselingType}
            limit={fetchParams.limit}
            loading={loading}
            onSearch={search => setFetchParams({ search })}
            onTypeChange={type => setFetchParams({ counselingType: type as CounselingType | '' })}
            onLimitChange={limit => setFetchParams({ limit, page: 1 })}
            onRefresh={refetch}
          />
        </motion.div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CounselingTableHeader />

            <CounselingTableBody
              records={records}
              loading={loading}
              searchActive={!!fetchParams.search}
              searchTerm={fetchParams.search}
            />

            {pagination && (
              <CounselingPaginationBar
                pagination={pagination}
                onPageChange={page => setFetchParams({ page })}
              />
            )}
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}