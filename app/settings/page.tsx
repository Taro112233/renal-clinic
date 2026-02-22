// app/settings/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SettingsPage } from '@/components/SettingsPage';
import { ProfileSkeleton } from '@/components/ProfilePage/ProfileSkeleton';

export default function Settings() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && user.role === 'USER') router.push('/dashboard');
  }, [loading, user, router]);

  if (loading) return <ProfileSkeleton />;
  if (!user || user.role === 'USER') return null;

  return <SettingsPage />;
}