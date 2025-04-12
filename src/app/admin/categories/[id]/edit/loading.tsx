'use client';

import { Container } from '@chakra-ui/react';

import CategoryFormLoading from '@/components/loading/CategoryFormLoading';

const EditCategoryLoadingPage = () => {
  return (
    <Container maxW='container.md' py={8}>
      <CategoryFormLoading />
    </Container>
  );
};

export default EditCategoryLoadingPage;
