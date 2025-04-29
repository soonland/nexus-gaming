'use client';

import { Box } from '@mui/material';
import type React from 'react';

import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      minHeight='100vh'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s',
      }}
    >
      <Navbar />
      <Box
        component='main'
        sx={{
          pt: '88px',
          flex: 1,
          bgcolor: 'background.default',
          transition: 'background-color 0.3s, opacity 0.15s',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
