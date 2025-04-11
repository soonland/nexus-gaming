'use client'

import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import '@/lib/dayjs'
import { CacheProvider } from '@chakra-ui/next-js'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
