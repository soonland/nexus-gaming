'use client'

import { CreateAnnouncementForm } from '@/components/admin/CreateAnnouncementForm'
import { Card, CardBody, CardHeader, Container, Heading } from '@chakra-ui/react'

export default function AnnouncementsPage() {
  return (
    <Container maxW="container.lg" py={8}>
      <Card>
        <CardHeader>
          <Heading size="md">Créer une nouvelle annonce</Heading>
        </CardHeader>
        <CardBody>
          <CreateAnnouncementForm />
        </CardBody>
      </Card>
    </Container>
  )
}
