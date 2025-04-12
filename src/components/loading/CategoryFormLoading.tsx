'use client';

import { Box, Container, VStack, Skeleton, Stack } from '@chakra-ui/react';

export default function CategoryFormLoading() {
  return (
    <Container maxW='container.md' py={8}>
      <VStack align='stretch' spacing={8}>
        <Skeleton height='36px' width='250px' />

        <Box>
          <VStack spacing={4}>
            <Stack width='100%'>
              <Skeleton height='20px' width='100px' />
              <Skeleton height='40px' />
            </Stack>

            <Stack
              direction='row'
              justify='flex-end'
              pt={4}
              spacing={4}
              width='100%'
            >
              <Skeleton height='40px' width='100px' />
              <Skeleton height='40px' width='120px' />
            </Stack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
