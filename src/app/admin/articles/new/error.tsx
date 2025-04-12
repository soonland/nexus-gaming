'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

export default function NewArticleErrorPage() {
  return (
    <Container maxW='container.lg' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors de la création de l&apos;article
      </Alert>
    </Container>
  );
}
