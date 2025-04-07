'use client'

import React, { useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  HStack,
  useToast,
  Container,
  VStack,
  Heading,
  Select,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCategories } from '@/hooks/useCategories'
import GameSelector from './GameSelector'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@prisma/client'
import type { ArticleForm as IArticleForm, ArticleStatus } from '@/types'

const getAvailableStatuses = (role?: Role): ArticleStatus[] => {
  switch (role) {
    case 'SYSADMIN':
    case 'ADMIN':
      return ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'ARCHIVED'];
    case 'MODERATOR':
      return ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED'];
    case 'USER':
    default:
      return ['DRAFT', 'PENDING_APPROVAL'];
  }
};

interface ArticleFormProps {
  initialData?: Partial<IArticleForm>
  onSubmit: (data: IArticleForm) => Promise<void>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export default function ArticleForm({
  initialData,
  onSubmit,
  isLoading,
  mode = 'create',
}: ArticleFormProps) {
  const router = useRouter()
  const toast = useToast()
  const { categories } = useCategories()
  const { user } = useAuth()
  const availableStatuses = getAvailableStatuses(user?.role)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IArticleForm>({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      categoryId: initialData?.categoryId || '',
      gameIds: initialData?.gameIds ?? [],
      status: initialData?.status || 'DRAFT',
      publishedAt: initialData?.publishedAt,
    },
  })

  const status = watch('status')
  const gameIds = watch('gameIds') ?? []

  // Vérification si le statut actuel est autorisé
  useEffect(() => {
    if (status && !availableStatuses.includes(status)) {
      setValue('status', 'DRAFT');
    }
  }, [status, availableStatuses, setValue]);

  const onSubmitForm = async (data: IArticleForm) => {
    try {
      // Si l'article est publié et qu'il n'y a pas de date de publication, on la définit
      if (data.status === 'PUBLISHED' && !data.publishedAt) {
        data.publishedAt = new Date().toISOString()
      }
      
      await onSubmit(data)
      toast({
        title: mode === 'create' ? 'Article créé' : 'Article mis à jour',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/articles')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch" as="form" onSubmit={handleSubmit(onSubmitForm)}>
        <Heading size="lg">
          {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
        </Heading>

        <Stack spacing={6}>
          <HStack spacing={4} width="100%">
            <FormControl isInvalid={!!errors.categoryId} flex="1">
              <FormLabel>Catégorie</FormLabel>
              <Select
                {...register('categoryId', { required: 'La catégorie est requise' })}
                placeholder="Sélectionner une catégorie"
              >
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId ? (
                <FormErrorMessage>{errors.categoryId.message}</FormErrorMessage>
              ) : (
                <FormHelperText>&nbsp;</FormHelperText>
              )}
            </FormControl>

            <FormControl flex="1">
              <FormLabel>Statut de l'article</FormLabel>
            <Select
              value={status}
              onChange={(e) => {
                setValue('status', e.target.value as ArticleStatus);
                if (e.target.value === 'PUBLISHED' && !watch('publishedAt')) {
                  setValue('publishedAt', new Date().toISOString());
                }
              }}
            >
              {availableStatuses.includes('DRAFT') && (
                <option value="DRAFT">🔸 Brouillon</option>
              )}
              {availableStatuses.includes('PENDING_APPROVAL') && (
                <option value="PENDING_APPROVAL">🔶 En attente d'approbation</option>
              )}
              {availableStatuses.includes('PUBLISHED') && (
                <option value="PUBLISHED">🟢 Publié</option>
              )}
              {availableStatuses.includes('ARCHIVED') && (
                <option value="ARCHIVED">⚪ Archivé</option>
              )}
            </Select>
              <FormHelperText>
                {status === 'DRAFT' && "L'article n'est visible que par vous"}
                {status === 'PENDING_APPROVAL' && "En attente de validation par un modérateur"}
                {status === 'PUBLISHED' && "L'article est visible publiquement"}
                {status === 'ARCHIVED' && "L'article n'est plus visible"}
              </FormHelperText>
            </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.title}>
            <FormLabel>Titre</FormLabel>
            <Input
              {...register('title', { required: 'Le titre est requis' })}
              placeholder="Titre de l'article"
            />
            {errors.title && (
              <FormErrorMessage>{errors.title.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.content}>
            <FormLabel>Contenu</FormLabel>
            <Textarea
              {...register('content', { required: 'Le contenu est requis' })}
              placeholder="Contenu de l'article"
              minH="300px"
            />
            {errors.content && (
              <FormErrorMessage>{errors.content.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Jeux associés</FormLabel>
            <GameSelector
              selectedIds={gameIds}
              onChange={(ids) => setValue('gameIds', ids)}
            />
          </FormControl>

          <HStack justify="flex-end" spacing={4} pt={4}>
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
          </HStack>
        </Stack>
      </VStack>
    </Container>
  )
}
