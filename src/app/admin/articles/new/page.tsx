'use client';

import {
  Container,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';

import { useArticles } from '@/hooks/useArticles';
import type { ArticleForm as IArticleForm } from '@/types';

import ArticleForm from '../_components/ArticleForm';

const NewArticlePage = () => {
  const { createArticle, isCreating } = useArticles();

  const handleSubmit = async (data: IArticleForm) => {
    await createArticle(data);
  };

  return (
    <Container maxW='container.lg' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Nouvel article</Heading>
        </CardHeader>
        <CardBody>
          <ArticleForm
            isLoading={isCreating}
            mode='create'
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default NewArticlePage;
