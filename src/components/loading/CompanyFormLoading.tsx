'use client'

import React from 'react'
import {
  Container,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  Box,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'

export default function CompanyFormLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.md" py={8}>
      <Box borderWidth="1px" borderColor={borderColor} rounded="lg" p={6}>
        <VStack spacing={4}>
          <Skeleton height="36px" width="300px" />

          <FormControl>
            <FormLabel>Nom</FormLabel>
            <Skeleton height="40px" />
          </FormControl>

          <FormControl>
            <Stack spacing={2}>
              <Skeleton height="24px" width="140px" />
              <Skeleton height="24px" width="140px" />
            </Stack>
          </FormControl>

          <Stack direction="row" spacing={4} justify="flex-end" width="100%" pt={4}>
            <Skeleton height="40px" width="100px" />
            <Skeleton height="40px" width="100px" />
          </Stack>
        </VStack>
      </Box>
    </Container>
  )
}
