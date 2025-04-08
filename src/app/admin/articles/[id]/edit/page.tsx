'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container, Alert, AlertIcon } from '@chakra-ui/react'
import ArticleForm from '../../_components/ArticleForm'
import { useArticle, useArticles } from '@/hooks/useArticles'
import type { ArticleForm as ArticleFormData } from '@/types'
import ArticleFormLoading from '@/components/loading/ArticleFormLoading'
import dayjs from '@/lib/dayjs'

export default function EditArticlePage() {
  const params = useParams()
  const id = params.id as string
  const { article, isLoading: isLoadingArticle, error } = useArticle(id)
  const { updateArticle, isUpdating } = useArticles()
  const router = useRouter()

  const handleSubmit = async (data: ArticleFormData) => {
    await updateArticle(id, data)
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          Une erreur est survenue lors du chargement de l&apos;article
        </Alert>
      </Container>
    )
  }

  if (isLoadingArticle) {
    return (
      <Container maxW="container.lg" py={8}>
        <ArticleFormLoading />
      </Container>
    )
  }

  if (!article) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          Article introuvable
        </Alert>
      </Container>
    )
  }

  const initialData = {
    title: article.title,
    content: article.content,
    categoryId: article.category.id,
    gameIds: article.games.map(g => g.id),
    status: article.status,
    publishedAt: article.publishedAt ? dayjs(article.publishedAt).format('YYYY-MM-DD') : undefined,
    user: article.user,
  }

  return (
    <ArticleForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      mode="edit"
    />
  )
}
