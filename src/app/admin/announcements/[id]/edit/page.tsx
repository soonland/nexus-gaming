'use client'

import React, { useEffect } from 'react'
import { Container, Heading, Card, CardHeader, CardBody, Spinner, Center } from '@chakra-ui/react'
import AnnouncementForm from '../../_components/AnnouncementForm'
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement'
import { useParams } from 'next/navigation'

export default function EditAnnouncementPage() {
  const params = useParams()
  const id = params.id as string
  const { announcement, updateAnnouncement } = useAdminAnnouncement(id)

  const handleSubmit = async (data: any) => {
    await updateAnnouncement.mutateAsync({ id, ...data })
  }

  if (!announcement) {
    return (
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Modifier l'annonce</Heading>
        </CardHeader>
        <CardBody>
          <AnnouncementForm
            initialData={{
              message: announcement.message,
              type: announcement.type,
              expiresAt: announcement.expiresAt || undefined,
              isActive: announcement.isActive,
            }}
            onSubmit={handleSubmit}
            isLoading={updateAnnouncement.isPending}
            mode="edit"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
