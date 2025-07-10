'use client';

import { Box } from '@mui/material';
import type React from 'react';

import { PublicAnnouncements } from '@/components/common';

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
        transition: 'background-color 0.3s, padding 0.3s',
      }}
    >
      <Navbar />
      <PublicAnnouncements />
      <Box
        component='main'
        sx={theme => ({
          pt: theme.spacing(5),
          flex: 1,
          bgcolor: 'background.default',
          transition: 'background-color 0.3s, opacity 0.15s, padding-top 0.3s',
        })}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
