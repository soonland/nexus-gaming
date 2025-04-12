'use client'

import { Container, useToast, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
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
      })
      router.push('/admin/categories')
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la catégorie',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Nouvelle catégorie</Heading>
        </CardHeader>
        <CardBody>
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/categories')}
            isLoading={isCreating}
            mode="create"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
