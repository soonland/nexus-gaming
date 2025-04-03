'use client'

import React from 'react'
import {
  Container,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'

export default function ArticleFormLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.lg" py={8}>
      <Box borderWidth="1px" borderColor={borderColor} rounded="lg" p={6}>
        <VStack spacing={6}>
          <Skeleton height="36px" width="300px" />

          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Skeleton height="40px" />
          </FormControl>

          <FormControl>
            <FormLabel>Catégorie</FormLabel>
            <Skeleton height="40px" />
          </FormControl>

          <FormControl>
            <FormLabel>Contenu</FormLabel>
            <Skeleton height="300px" />
          </FormControl>

          <FormControl>
            <FormLabel>Jeux associés</FormLabel>
            <VStack align="stretch" spacing={2}>
              <Skeleton height="40px" width="200px" />
              <Skeleton height="60px" />
            </VStack>
          </FormControl>

          <VStack spacing={4} alignSelf="flex-end">
            <Skeleton height="40px" width="200px" />
          </VStack>
        </VStack>
      </Box>
    </Container>
  )
}
