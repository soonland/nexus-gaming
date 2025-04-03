'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useArticles, type ArticleFormData } from '@/hooks/useArticles'
import ArticleForm from '@/app/admin/articles/_components/ArticleForm'

export default function NewArticlePage() {
  const { createArticle, isCreating } = useArticles()
  const router = useRouter()

  const handleSubmit = async (data: ArticleFormData) => {
    await createArticle(data)
    router.push('/admin/articles')
  }

  return (
    <ArticleForm
      onSubmit={handleSubmit}
      isLoading={isCreating}
      mode="create"
    />
  )
}
