'use client';

import {
  Container,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';

import ArticleFormLoading from '@/components/loading/ArticleFormLoading';
import { useArticle, useArticles } from '@/hooks/useArticles';
import dayjs from '@/lib/dayjs';
import type { ArticleForm as ArticleFormData } from '@/types';

import ArticleForm from '../../_components/ArticleForm';

const EditArticlePage = () => {
  const params = useParams();
  const id = params.id as string;
  const { article, isLoading: isLoadingArticle, error } = useArticle(id);
  const { updateArticle, isUpdating } = useArticles();

  const handleSubmit = async (data: ArticleFormData) => {
    await updateArticle(id, data);
  };

  if (error) {
    return (
      <Container maxW='container.lg' py={8}>
        <Alert status='error'>
          <AlertIcon />
          Une erreur est survenue lors du chargement de l&apos;article
        </Alert>
      </Container>
    );
  }

  if (isLoadingArticle) {
    return (
      <Container maxW='container.lg' py={8}>
        <ArticleFormLoading />
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxW='container.lg' py={8}>
        <Alert status='error'>
          <AlertIcon />
          Article introuvable
        </Alert>
      </Container>
    );
  }

  const initialData = {
    title: article.title,
    content: article.content,
    categoryId: article.category.id,
    gameIds: article.games.map(g => g.id),
    status: article.status,
    publishedAt: article.publishedAt
      ? dayjs(article.publishedAt).format('YYYY-MM-DD')
      : undefined,
    user: article.user,
    heroImage: article.heroImage,
  };

  return (
    <Container maxW='container.lg' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Modifier l&apos;article</Heading>
        </CardHeader>
        <CardBody>
          <ArticleForm
            initialData={initialData}
            isLoading={isUpdating}
            mode='edit'
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditArticlePage;
