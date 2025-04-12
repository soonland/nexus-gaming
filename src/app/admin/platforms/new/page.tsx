'use client';

import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { usePlatforms } from '@/hooks/usePlatforms';

import PlatformForm from '../_components/PlatformForm';

export default function NewPlatformPage() {
  const { createPlatform, isCreating } = usePlatforms();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createPlatform(data);
    router.push('/admin/platforms');
  };

  return (
    <Container maxW='container.md' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Nouvelle plateforme</Heading>
        </CardHeader>
        <CardBody>
          <PlatformForm
            isLoading={isCreating}
            mode='create'
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
}
