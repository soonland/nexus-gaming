'use client'

import React from 'react'
import { Box } from '@chakra-ui/react'
import { Navbar } from './Navbar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box as="main">{children}</Box>
    </Box>
  )
}
