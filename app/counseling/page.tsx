// app/counseling/page.tsx
'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CounselingList } from '@/components/CounselingList';
import { CounselingListSkeleton } from '@/components/CounselingList/CounselingListSkeleton';

export default function CounselingPage() {
  const { loading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <CounselingListSkeleton />;
  if (!isAuthenticated) return null;

  return <CounselingList />;
}