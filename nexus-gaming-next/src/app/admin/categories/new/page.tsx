'use client'

import React from 'react'
import { Container, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import CategoryForm from '@/app/admin/categories/_components/CategoryForm'
import { useCategories } from '@/hooks/useCategories'

export default function NewCategoryPage() {
  const { createCategory, isCreating } = useCategories()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (data: { name: string }) => {
    try {
      await createCategory(data)
      toast({
        title: 'Catégorie créée',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/admin/categories')
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la catégorie',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <CategoryForm
        onSubmit={handleSubmit}
        isLoading={isCreating}
        mode="create"
      />
    </Container>
  )
}
