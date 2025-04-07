'use client'

import React from 'react'
import { Container } from '@chakra-ui/react'
import CategoryFormLoading from '@/components/loading/CategoryFormLoading'

export default function NewCategoryLoadingPage() {
  return (
    <Container maxW="container.md" py={8}>
      <CategoryFormLoading />
    </Container>
  )
}
