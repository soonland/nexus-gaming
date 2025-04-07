'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { usePlatforms } from '@/hooks/usePlatforms'
import PlatformForm from '../_components/PlatformForm'

export default function NewPlatformPage() {
  const { createPlatform, isCreating } = usePlatforms()
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await createPlatform(data)
    router.push('/admin/platforms')
  }

  return (
    <PlatformForm
      onSubmit={handleSubmit}
      isLoading={isCreating}
      mode="create"
    />
  )
}
