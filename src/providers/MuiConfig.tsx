'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ReactNode } from 'react';
import 'dayjs/locale/fr';

interface IMuiConfigProps {
  children: ReactNode;
}

export const MuiConfig = ({ children }: IMuiConfigProps) => {
  return (
    <LocalizationProvider adapterLocale='fr' dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};
