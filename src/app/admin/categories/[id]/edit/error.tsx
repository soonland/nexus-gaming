'use client';

import { Container, Alert, AlertIcon } from '@chakra-ui/react';

const EditCategoryErrorPage = () => {
  return (
    <Container maxW='container.md' py={8}>
      <Alert status='error'>
        <AlertIcon />
        Une erreur est survenue lors de la modification de la catégorie
      </Alert>
    </Container>
  );
};

export default EditCategoryErrorPage;
