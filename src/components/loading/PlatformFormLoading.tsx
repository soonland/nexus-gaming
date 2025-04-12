'use client';

import {
  Container,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

export default function PlatformFormLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW='container.md' py={8}>
      <VStack align='stretch' spacing={8}>
        <Skeleton height='36px' width='300px' />

        <Box borderColor={borderColor} borderWidth='1px' p={6} rounded='lg'>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Skeleton height='40px' />
            </FormControl>

            <FormControl>
              <FormLabel>Fabricant</FormLabel>
              <Skeleton height='40px' />
            </FormControl>

            <FormControl>
              <FormLabel>Date de sortie</FormLabel>
              <Skeleton height='40px' />
            </FormControl>

            <Skeleton alignSelf='flex-end' height='40px' width='200px' />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
