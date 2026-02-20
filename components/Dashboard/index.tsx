// components/Dashboard/index.tsx
'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PendingApproval } from '@/components/PendingApproval';
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from './DashboardSkeleton';

export function Dashboard() {
  const { user, loading } = useCurrentUser();

  // Show skeleton while loading
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Redirect to login if not authenticated (handled by AuthGuard, but safety check)
  if (!user) {
    return null;
  }

  // Show pending approval page for USER role
  if (user.role === 'USER') {
    return <PendingApproval />;
  }

  // Show normal dashboard for ADMIN and SUPERADMIN
  return <DashboardContent user={user} />;
}