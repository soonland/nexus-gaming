'use client';

import { Box } from '@mui/material';
import type React from 'react';

import { Navbar } from './Navbar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minHeight='100vh'>
      <Navbar />
      <Box
        component='main'
        sx={{
          pt: '88px',
          transition: 'opacity 0.15s',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
