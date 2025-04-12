'use client'

import { Container, Alert, AlertIcon, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { usePlatform, usePlatforms } from '@/hooks/usePlatforms'
import PlatformForm from '../../_components/PlatformForm'
import type { PlatformForm as PlatformFormType } from '@/types'
import PlatformFormLoading from '@/components/loading/PlatformFormLoading'

export default function EditPlatformPage() {
  const params = useParams()
  const id = params.id as string
  const { platform, isLoading } = usePlatform(id)
  const { updatePlatform, isUpdating } = usePlatforms()
  const router = useRouter()

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <PlatformFormLoading />
      </Container>
    )
  }

  if (!platform) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Plateforme non trouvée
        </Alert>
      </Container>
    )
  }

  const handleSubmit = async (data: PlatformFormType) => {
    await updatePlatform({ id, data })
    router.push('/admin/platforms')
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Modifier la plateforme</Heading>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </Container>
  )
}
