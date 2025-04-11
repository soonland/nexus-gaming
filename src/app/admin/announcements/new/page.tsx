'use client'

import React from 'react'
import { Container, Heading, Card, CardHeader, CardBody } from '@chakra-ui/react'
import AnnouncementForm from '../_components/AnnouncementForm'
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement'

export default function NewAnnouncementPage() {
  const { createAnnouncement } = useAdminAnnouncement()

  const handleSubmit = async (data: any) => {
    await createAnnouncement.mutateAsync(data)
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Nouvelle annonce</Heading>
        </CardHeader>
        <CardBody>
          <AnnouncementForm
            onSubmit={handleSubmit}
            isLoading={createAnnouncement.isPending}
            mode="create"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
