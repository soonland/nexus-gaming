'use client';

import { Box, Container } from '@mui/material';
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
      <Box
        component='div'
        sx={{
          bgcolor: theme =>
            theme.palette.mode === 'dark'
              ? 'background.paper'
              : theme.palette.grey[50],
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
          position: 'fixed',
          top: '64px',
          width: '100%',
          zIndex: theme => theme.zIndex.appBar - 1,
          WebkitBackdropFilter: 'blur(8px)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth='lg' sx={{ py: 0.5 }}>
          <PublicAnnouncements />
        </Container>
      </Box>
      <Box
        component='main'
        sx={theme => ({
          pt: theme.spacing(15),
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
