'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

export default function EditGameError() {
  return (
    <Container maxW='container.xl' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors du chargement du jeu
      </Alert>
    </Container>
  );
}
