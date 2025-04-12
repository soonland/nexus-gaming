'use client'

import {
  Container,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'

export default function PlatformFormLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Skeleton height="36px" width="300px" />

        <Box borderWidth="1px" borderColor={borderColor} rounded="lg" p={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Skeleton height="40px" />
            </FormControl>

            <FormControl>
              <FormLabel>Fabricant</FormLabel>
              <Skeleton height="40px" />
            </FormControl>

            <FormControl>
              <FormLabel>Date de sortie</FormLabel>
              <Skeleton height="40px" />
            </FormControl>

            <Skeleton height="40px" width="200px" alignSelf="flex-end" />
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
