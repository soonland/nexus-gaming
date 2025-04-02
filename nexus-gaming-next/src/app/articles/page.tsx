'use client'

import React from 'react'
import {
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { useArticles } from '@/hooks/useArticles'

export default function ArticlesPage() {
  const { data: articles, isLoading, error } = useArticles()

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading articles
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Articles
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} height="400px" />)
          : articles?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
      </SimpleGrid>
    </Container>
  )
}
