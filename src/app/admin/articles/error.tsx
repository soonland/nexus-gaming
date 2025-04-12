'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

const ArticlesErrorPage = () => {
  return (
    <Container maxW='container.xl' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors du chargement des articles
      </Alert>
    </Container>
  );
};

export default ArticlesErrorPage;
