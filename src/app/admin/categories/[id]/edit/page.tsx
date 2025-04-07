'use client'

import React from 'react'
import { Container, useToast, Alert, AlertIcon } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '@/app/admin/categories/_components/CategoryForm'
import { useCategories, useCategory } from '@/hooks/useCategories'
import CategoryFormLoading from '@/components/loading/CategoryFormLoading'

export default function EditCategoryPage() {
  const params = useParams()
  const id = params.id as string
  const { category, isLoading: isLoadingCategory, error } = useCategory(id)
  const { updateCategory, isUpdating } = useCategories()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (data: { name: string }) => {
    try {
      await updateCategory({ id, data })
      toast({
        title: 'Catégorie modifiée',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/categories')
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la catégorie',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading category
        </Alert>
      </Container>
    )
  }

  if (isLoadingCategory) {
    return (
      <Container maxW="container.md" py={8}>
        <CategoryFormLoading />
      </Container>
    )
  }

  if (!category) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Category not found
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <CategoryForm
        initialData={{ name: category.name }}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/categories')}
        isLoading={isUpdating}
        mode="edit"
      />
    </Container>
  )
}
