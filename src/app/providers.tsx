'use client';

import type React from 'react';

import { AppLayout } from '@/components/layout/AppLayout';

import '@/lib/dayjs';
import { CacheProvider } from '@chakra-ui/next-js';

import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
