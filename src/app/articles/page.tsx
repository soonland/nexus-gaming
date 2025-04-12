'use client';

import {
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import { ArticleCard } from '@/components/articles/ArticleCard';
import { useArticles } from '@/hooks/useArticles';
import type { ArticleData } from '@/types';

export default function ArticlesPage() {
  const { data, isLoading, error } = useArticles({
    limit: '100',
    status: 'PUBLISHED',
  });
  const articles = data?.articles || [];

  if (error) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error'>
          <AlertIcon />
          {error instanceof Error ? error.message : 'Error loading articles'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={8}>
      <Heading as='h1' mb={6}>
        Articles
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} height='400px' />)
          : articles
              ?.filter(
                (article): article is ArticleData & { publishedAt: Date } =>
                  article.publishedAt !== null
              )
              .map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
      </SimpleGrid>
    </Container>
  );
}
