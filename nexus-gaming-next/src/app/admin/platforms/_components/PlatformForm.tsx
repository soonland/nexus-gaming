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

interface PlatformFormData {
  name: string
  manufacturer: string
  releaseDate: string | null
}

interface PlatformFormProps {
  initialData?: PlatformFormData
  onSubmit: (data: PlatformFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function PlatformForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: PlatformFormProps) {
  const [formData, setFormData] = React.useState<PlatformFormData>({
    name: initialData?.name || '',
    manufacturer: initialData?.manufacturer || '',
    releaseDate: initialData?.releaseDate || null,
  })
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      toast({
        title: mode === 'create' ? 'Plateforme créée' : 'Plateforme mise à jour',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/platforms')
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
          {mode === 'create' ? 'Nouvelle plateforme' : 'Modifier la plateforme'}
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: PlayStation 5"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Fabricant</FormLabel>
              <Input
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manufacturer: e.target.value,
                  }))
                }
                placeholder="Ex: Sony"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Date de sortie</FormLabel>
              <Input
                type="date"
                value={formData.releaseDate?.split('T')[0] || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    releaseDate: e.target.value || null,
                  }))
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
                onClick={() => router.push('/admin/platforms')}
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
      </VStack>
    </Container>
  )
}
