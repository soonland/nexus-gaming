'use client';

import {
  Container,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';

import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import dayjs from '@/lib/dayjs';

import AnnouncementForm from '../../_components/AnnouncementForm';

const EditAnnouncementPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { announcement, updateAnnouncement } = useAdminAnnouncement(id);

  const handleSubmit = async (data: any) => {
    await updateAnnouncement.mutateAsync({ id, ...data });
  };

  if (!announcement) {
    return (
      <Center py={8}>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <Container maxW='container.lg' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Modifier l'annonce</Heading>
        </CardHeader>
        <CardBody>
          <AnnouncementForm
            initialData={{
              message: announcement.message,
              type: announcement.type,
              expiresAt: announcement.expiresAt
                ? dayjs(announcement.expiresAt).toDate()
                : null,
              isActive: announcement.isActive,
            }}
            isLoading={updateAnnouncement.isPending}
            mode='edit'
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditAnnouncementPage;
