// components/PendingApproval/index.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PendingApprovalHeader } from './PendingApprovalHeader';
import { PendingApprovalContent } from './PendingApprovalContent';
import { PendingApprovalSkeleton } from './PendingApprovalSkeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function PendingApproval() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <PendingApprovalSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      {/* Background gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PendingApprovalHeader user={user} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <PendingApprovalContent user={user} />
        </motion.div>
      </div>
    </motion.div>
  );
}