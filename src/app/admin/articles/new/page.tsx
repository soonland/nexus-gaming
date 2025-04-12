'use client'

import { Container, Heading, Card, CardHeader, CardBody } from '@chakra-ui/react'
import ArticleForm from '../_components/ArticleForm'
import { useArticles } from '@/hooks/useArticles'
import type { ArticleForm as IArticleForm } from '@/types'

export default function NewArticlePage() {
  const { createArticle, isCreating } = useArticles()

  const handleSubmit = async (data: IArticleForm) => {
    await createArticle(data)
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Nouvel article</Heading>
        </CardHeader>
        <CardBody>
          <ArticleForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
            mode="create"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
