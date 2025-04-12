'use client';

import { Container } from '@chakra-ui/react';

import CategoryFormLoading from '@/components/loading/CategoryFormLoading';

const NewCategoryLoadingPage = () => {
  return (
    <Container maxW='container.md' py={8}>
      <CategoryFormLoading />
    </Container>
  );
};

export default NewCategoryLoadingPage;
