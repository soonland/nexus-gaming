'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

const EditGameError = () => {
  return (
    <Container maxW='container.xl' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors du chargement du jeu
      </Alert>
    </Container>
  );
};

export default EditGameError;
