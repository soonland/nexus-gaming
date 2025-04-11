'use client'

import { AdminAnnouncementBanner } from '@/components/admin/AdminAnnouncementBanner'
import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !['ADMIN', 'SYSADMIN'].includes(user.role))) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !['ADMIN', 'SYSADMIN'].includes(user.role)) {
    return null
  }

  return (
    <Box>
      <AdminAnnouncementBanner />
      <Box>{children}</Box>
    </Box>
  )
}
