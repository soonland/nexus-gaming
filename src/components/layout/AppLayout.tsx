'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';

import { Navbar } from './Navbar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading: authLoading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show navigation loading if we're not in an auth loading state
    if (!authLoading) {
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, authLoading]);

  return (
    <Box minHeight='100vh'>
      <LoadingOverlay isLoading={authLoading || isNavigating} />
      <Navbar />
      <Box
        component='main'
        sx={{
          pt: '88px',
          opacity: authLoading || isNavigating ? 0 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
