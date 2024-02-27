'use client';
import Auth from '@/components/auth';
import InitialScreenLoader from '@/components/initial-screen-loader';
import { useProfile } from '@/hooks/queries/useProfile';
import { usePrevious } from '@/hooks/usePrevious';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

type Props = { children: React.ReactNode };
export default function AuthProvider({ children }: Props) {
  const { data: profile, isLoading, error } = useProfile();
  const previousId = usePrevious(profile?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!previousId || previousId === profile?.id) return;

    if (!queryClient.isFetching({ queryKey: ['profile'] })) {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
    if (!queryClient.isFetching({ queryKey: ['chats'] })) {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }

    return () => {
      queryClient.setQueryData(['chats'], null);
    };
  }, [previousId, profile?.id, queryClient]);

  if (isLoading) return <InitialScreenLoader />;
  if (!profile || error) return <Auth />;
  return <>{children}</>;
}
