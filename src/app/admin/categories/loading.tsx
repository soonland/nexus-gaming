'use client'

import {
  Container,
  VStack,
  HStack,
  Skeleton,
} from '@chakra-ui/react'
import CategoryListLoading from '@/components/loading/CategoryListLoading'

export default function CategoriesLoadingPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Skeleton height="36px" width="200px" />
          <Skeleton height="40px" width="180px" />
        </HStack>

        <HStack mb={4}>
          <Skeleton height="40px" width="300px" />
        </HStack>

        <CategoryListLoading />
      </VStack>
    </Container>
  )
}
