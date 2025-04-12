'use client';

import { Box } from '@chakra-ui/react';
import type React from 'react';

import { Navbar } from './Navbar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH='100vh'>
      <Navbar />
      <Box as='main'>{children}</Box>
    </Box>
  );
};
