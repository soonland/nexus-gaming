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
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

interface CategoryFormProps {
  initialData?: {
    name: string
  }
  onSubmit: (data: { name: string }) => Promise<void>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export default function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
  mode = 'create',
}: CategoryFormProps) {
  const [name, setName] = React.useState(initialData?.name || '')
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({ name })
      toast({
        title: mode === 'create' ? 'Catégorie créée' : 'Catégorie mise à jour',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/categories')
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
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">
          {mode === 'create' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la catégorie"
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
                onClick={() => router.push('/admin/categories')}
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
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
