'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

const NewGameError = () => {
  return (
    <Container maxW='container.xl' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors de la création du jeu
      </Alert>
    </Container>
  );
};

export default NewGameError;
