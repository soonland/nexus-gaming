'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useArticles, useArticle, type ArticleFormData } from '@/hooks/useArticles'
import ArticleForm from '@/app/admin/articles/_components/ArticleForm'

export default function EditArticlePage() {
  const params = useParams()
  const id = params.id as string
  const { article, isLoading } = useArticle(id)
  const { updateArticle, isUpdating } = useArticles()
  const router = useRouter()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!article) {
    return <div>Article non trouvé</div>
  }

  const handleSubmit = async (data: ArticleFormData) => {
    await updateArticle({ id, data })
    router.push('/admin/articles')
  }

  const initialData = {
    title: article.title,
    content: article.content,
    categoryId: article.category?.id || undefined,
    gameIds: article.games.map(game => game.id),
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
