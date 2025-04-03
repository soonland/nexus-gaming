'use client'

import React from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import GameSelector from './GameSelector'
import CategorySelect from './CategorySelect'

interface ArticleFormData {
  title: string
  content: string
  categoryId?: string
  gameIds: string[]
}

interface ArticleFormProps {
  initialData?: ArticleFormData
  onSubmit: (data: ArticleFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function ArticleForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: ArticleFormProps) {
  const [formData, setFormData] = React.useState<ArticleFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId,
    gameIds: initialData?.gameIds || [],
  })
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast({
        title: 'Erreur',
        description: 'Le titre et le contenu sont requis',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      await onSubmit(formData)
      router.push('/admin/articles')
      toast({
        title: 'Succès',
        description: mode === 'create' ? 'Article créé' : 'Article mis à jour',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleCategoryChange = (categoryId: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
    }))
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Titre</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Titre de l'article"
            />
          </FormControl>

          <CategorySelect
            value={formData.categoryId}
            onChange={handleCategoryChange}
          />

          <FormControl isRequired>
            <FormLabel>Contenu</FormLabel>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Contenu de l'article"
              minHeight="300px"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Jeux associés</FormLabel>
            <GameSelector
              selectedIds={formData.gameIds}
              onChange={(gameIds) =>
                setFormData((prev) => ({ ...prev, gameIds }))
              }
            />
          </FormControl>

          <Stack
            direction="row"
            spacing={4}
            justify="flex-end"
            width="100%"
            pt={4}
          >
            <Button
              onClick={() => router.push('/admin/articles')}
              variant="ghost"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
            >
              {mode === 'create' ? 'Créer' : 'Mettre à jour'}
            </Button>
          </Stack>
        </VStack>
      </Box>
    </Container>
  )
}
