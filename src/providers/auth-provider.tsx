'use client';
import Auth from '@/components/auth';
import { useProfile } from '@/hooks/queries/userProfile';
import React from 'react';

type Props = { children: React.ReactNode };
export default function AuthProvider({ children }: Props) {
  const { data, isLoading } = useProfile();
  if (isLoading) return null;
  if (!data) return <Auth />;
  return <>{children}</>;
}
