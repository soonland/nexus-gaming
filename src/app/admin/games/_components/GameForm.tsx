'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  Heading,
  useToast,
  Textarea,
  Select,
  Text,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useCompanies } from '@/hooks/useCompanies'
import PlatformSelect from './PlatformSelect'

import type { GameForm as IGameForm, CompanyData } from '@/types'
import InlineCompanyCreation from './InlineCompanyCreation'

interface GameFormProps {
  initialData?: Partial<IGameForm>
  onSubmit: (data: IGameForm) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function GameForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: GameFormProps) {
  const [formData, setFormData] = React.useState<IGameForm>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    releaseDate: initialData?.releaseDate || null,
    coverImage: initialData?.coverImage || null,
    platformIds: initialData?.platformIds || [],
    developerId: initialData?.developerId || '',
    publisherId: initialData?.publisherId || '',
  })

  const [inlineCreation, setInlineCreation] = React.useState<{
    show: boolean
    type: 'developer' | 'publisher'
  }>({ show: false, type: 'developer' })
  const router = useRouter()
  const toast = useToast()
  const { companies = [] } = useCompanies()

  const developers = companies.filter(company => company.isDeveloper)
  const publishers = companies.filter(company => company.isPublisher)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      toast({
        title: mode === 'create' ? 'Jeu créé' : 'Jeu mis à jour',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/games')
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
          {mode === 'create' ? 'Nouveau jeu' : 'Modifier le jeu'}
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Titre</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: The Legend of Zelda: Tears of the Kingdom"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description du jeu..."
                rows={5}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Développeur</FormLabel>
              <Select
                value={formData.developerId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, developerId: e.target.value }))
                }
                placeholder="Sélectionner un développeur"
              >
                {developers.map((developer) => (
                  <option key={developer.id} value={developer.id}>
                    {developer.name}
                  </option>
                ))}
              </Select>
              {!inlineCreation.show && (
                <Text mt={1} fontSize="sm">
                  <Link
                    color="blue.500"
                    onClick={() => setInlineCreation({ show: true, type: 'developer' })}
                  >
                    Créer un nouveau développeur
                  </Link>
                </Text>
              )}
              {inlineCreation.show && inlineCreation.type === 'developer' && (
                <InlineCompanyCreation
                  type="developer"
                  onSuccess={(newCompany) => {
                    if (newCompany.isDeveloper) {
                      setFormData((prev) => ({ ...prev, developerId: newCompany.id }))
                    }
                    setInlineCreation((prev) => ({ ...prev, show: false }))
                  }}
                  onCancel={() => setInlineCreation((prev) => ({ ...prev, show: false }))}
                />
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Éditeur</FormLabel>
              <Select
                value={formData.publisherId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, publisherId: e.target.value }))
                }
                placeholder="Sélectionner un éditeur"
              >
                {publishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </Select>
              {!inlineCreation.show && (
                <Text mt={1} fontSize="sm">
                  <Link
                    color="blue.500"
                    onClick={() => setInlineCreation({ show: true, type: 'publisher' })}
                  >
                    Créer un nouvel éditeur
                  </Link>
                </Text>
              )}
              {inlineCreation.show && inlineCreation.type === 'publisher' && (
                <InlineCompanyCreation
                  type="publisher"
                  onSuccess={(newCompany) => {
                    if (newCompany.isPublisher) {
                      setFormData((prev) => ({ ...prev, publisherId: newCompany.id }))
                    }
                    setInlineCreation((prev) => ({ ...prev, show: false }))
                  }}
                  onCancel={() => setInlineCreation((prev) => ({ ...prev, show: false }))}
                />
              )}
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

            <FormControl>
              <FormLabel>Image de couverture</FormLabel>
              <Input
                value={formData.coverImage || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                placeholder="URL de l'image"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Plateformes</FormLabel>
              <PlatformSelect
                selectedIds={formData.platformIds}
                onChange={(platformIds) =>
                  setFormData((prev) => ({ ...prev, platformIds }))
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
                onClick={() => router.push('/admin/games')}
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
