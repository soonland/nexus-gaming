'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePlatform, usePlatforms } from '@/hooks/usePlatforms'
import PlatformForm from '../../_components/PlatformForm'
import type { PlatformForm as PlatformFormType } from '@/types'

export default function EditPlatformPage() {
  const params = useParams()
  const id = params.id as string
  const { platform, isLoading } = usePlatform(id)
  const { updatePlatform, isUpdating } = usePlatforms()
  const router = useRouter()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!platform) {
    return <div>Plateforme non trouvée</div>
  }

  const handleSubmit = async (data: PlatformFormType) => {
    await updatePlatform({ id, data })
    router.push('/admin/platforms')
  }

  return (
    <PlatformForm
      initialData={{
        name: platform.name,
        manufacturer: platform.manufacturer,
        releaseDate: platform.releaseDate?.toISOString() || null
      }}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      mode="edit"
    />
  )
}
