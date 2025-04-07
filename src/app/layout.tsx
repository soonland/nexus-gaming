import type { Metadata } from 'next'
import React from 'react'
import { Providers } from './providers'
import { Inter } from 'next/font/google'
import { AppLayout } from '@/components/layout/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexus Gaming',
  description: 'Your gaming community hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  )
}
