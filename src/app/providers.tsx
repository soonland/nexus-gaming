'use client';

import { ThemeProvider, createTheme } from '@mui/material';
import type React from 'react';

import { NotifierProvider } from '@/components/common/Notifier';
import { AppLayout } from '@/components/layout/AppLayout';
import '@/lib/dayjs';
import { AuthProvider } from '@/providers/AuthProvider';
import { MuiConfig } from '@/providers/MuiConfig';
import { QueryProvider } from '@/providers/QueryProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
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
