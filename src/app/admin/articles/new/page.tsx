'use client'

import React from 'react'
import ArticleForm from '../_components/ArticleForm'
import { useArticles } from '@/hooks/useArticles'
import type { ArticleForm as IArticleForm } from '@/types'

export default function NewArticlePage() {
  const { createArticle, isCreating } = useArticles()

  const handleSubmit = async (data: IArticleForm) => {
    await createArticle(data)
  }

  return (
    <ArticleForm
      onSubmit={handleSubmit}
      isLoading={isCreating}
      mode="create"
    />
  )
}
