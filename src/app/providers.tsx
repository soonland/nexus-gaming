'use client';

import type React from 'react';

import { NotifierProvider } from '@/components/common/Notifier';
import { AppLayout } from '@/components/layout/AppLayout';
import '@/lib/dayjs';
import { AuthProvider } from '@/providers/AuthProvider';
import { MuiConfig } from '@/providers/MuiConfig';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <MuiConfig>
            <NotifierProvider>
              <AppLayout>{children}</AppLayout>
            </NotifierProvider>
          </MuiConfig>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
