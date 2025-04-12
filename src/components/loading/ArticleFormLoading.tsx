'use client';

import { Container, VStack, Skeleton, Stack } from '@chakra-ui/react';

const ArticleFormLoading = () => {
  return (
    <Container maxW='container.lg' py={8}>
      <VStack align='stretch' spacing={8}>
        <Skeleton height='36px' width='300px' />

        <Stack spacing={6}>
          {/* Titre */}
          <Stack>
            <Skeleton height='20px' width='100px' />
            <Skeleton height='40px' />
          </Stack>

          {/* Contenu */}
          <Stack>
            <Skeleton height='20px' width='100px' />
            <Skeleton height='300px' />
          </Stack>

          {/* Catégorie */}
          <Stack>
            <Skeleton height='20px' width='100px' />
            <Skeleton height='40px' />
          </Stack>

          {/* Jeux associés */}
          <Stack>
            <Skeleton height='20px' width='100px' />
            <Stack spacing={2}>
              <Skeleton height='40px' />
              <Skeleton height='100px' />
            </Stack>
          </Stack>

          {/* Switch de publication */}
          <Skeleton height='24px' width='200px' />

          {/* Boutons */}
          <Stack direction='row' justify='flex-end' pt={4} spacing={4}>
            <Skeleton height='40px' width='100px' />
            <Skeleton height='40px' width='120px' />
          </Stack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default ArticleFormLoading;
