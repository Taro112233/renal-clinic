// app/counseling/new/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CounselingForm } from '@/components/CounselingForm';
import { LoadingState } from '@/components/shared/LoadingState';

export default function NewCounselingPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Only ADMIN and SUPERADMIN can record
    if (user?.role === 'USER') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) return <LoadingState message="กำลังโหลด..." fullScreen />;
  if (!isAuthenticated || user?.role === 'USER') return null;

  return <CounselingForm />;
}