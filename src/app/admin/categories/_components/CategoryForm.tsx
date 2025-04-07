'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface CategoryFormProps {
  initialData?: {
    name: string
  }
  onSubmit: (data: { name: string }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode = 'create',
}: CategoryFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: initialData?.name || '',
    },
  })

  const onSubmitForm = async (data: { name: string }) => {
    await onSubmit(data)
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch" as="form" onSubmit={handleSubmit(onSubmitForm)}>
        <Heading size="lg">
          {mode === 'create' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
        </Heading>

        <Stack spacing={6}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Nom</FormLabel>
            <Input
              {...register('name', { required: 'Le nom est requis' })}
              placeholder="Nom de la catégorie"
            />
            {errors.name && (
              <FormErrorMessage>{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>

          <Stack
            direction="row"
            spacing={4}
            justify="flex-end"
            width="100%"
            pt={4}
          >
            <Button
              onClick={onCancel}
              variant="ghost"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText={mode === 'create' ? 'Création...' : 'Enregistrement...'}
            >
              {mode === 'create' ? 'Créer' : 'Mettre à jour'}
            </Button>
          </Stack>
        </Stack>
      </VStack>
    </Container>
  )
}
