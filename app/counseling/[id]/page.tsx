// app/counseling/[id]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CounselingDetail } from '@/components/CounselingDetail';
import { CounselingDetailSkeleton } from '@/components/CounselingDetail/DetailSkeleton';

export default function CounselingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loading, isAuthenticated } = useCurrentUser();

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  if (loading) return <CounselingDetailSkeleton />;
  if (!isAuthenticated || !id) return null;

  return <CounselingDetail id={id} />;
}