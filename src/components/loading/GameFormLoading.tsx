'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  Skeleton,
  Stack,
} from '@chakra-ui/react'

export default function GameFormLoading() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Skeleton height="36px" width="300px" />

        <Box>
          <VStack spacing={4}>
            <Stack spacing={2} width="100%">
              <Skeleton height="20px" width="100px" />
              <Skeleton height="40px" />
            </Stack>

            <Stack spacing={2} width="100%">
              <Skeleton height="20px" width="120px" />
              <Skeleton height="40px" />
            </Stack>

            <Stack spacing={2} width="100%">
              <Skeleton height="20px" width="140px" />
              <Skeleton height="40px" />
            </Stack>

            <Stack spacing={2} width="100%">
              <Skeleton height="20px" width="160px" />
              <Skeleton height="40px" />
            </Stack>

            <Stack spacing={2} width="100%">
              <Skeleton height="20px" width="180px" />
              <Skeleton height="100px" />
            </Stack>

            <Stack direction="row" spacing={4} justify="flex-end" width="100%" pt={4}>
              <Skeleton height="40px" width="100px" />
              <Skeleton height="40px" width="100px" />
            </Stack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
