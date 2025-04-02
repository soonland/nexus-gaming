'use client'

import React from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Stack,
  Input,
  VStack,
  Checkbox,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

interface CompanyFormData {
  name: string
  isDeveloper: boolean
  isPublisher: boolean
}

interface CompanyFormProps {
  initialData?: CompanyFormData
  onSubmit: (data: CompanyFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function CompanyForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: CompanyFormProps) {
  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: initialData?.name || '',
    isDeveloper: initialData?.isDeveloper || false,
    isPublisher: initialData?.isPublisher || false,
  })
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: 'Erreur',
        description: 'Le nom est requis',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (!formData.isDeveloper && !formData.isPublisher) {
      toast({
        title: 'Erreur',
        description: 'La société doit être développeur et/ou éditeur',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      await onSubmit(formData)
      router.push('/admin/companies')
      toast({
        title: 'Succès',
        description: mode === 'create' ? 'Société créée' : 'Société mise à jour',
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

  return (
    <Container maxW="container.md" py={8}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nom de la société"
            />
          </FormControl>

          <FormControl>
            <Stack spacing={2}>
              <Checkbox
                isChecked={formData.isDeveloper}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDeveloper: e.target.checked,
                  }))
                }
              >
                Développeur
              </Checkbox>
              <Checkbox
                isChecked={formData.isPublisher}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublisher: e.target.checked,
                  }))
                }
              >
                Éditeur
              </Checkbox>
            </Stack>
          </FormControl>

          <Stack
            direction="row"
            spacing={4}
            justify="flex-end"
            width="100%"
            pt={4}
          >
            <Button
              onClick={() => router.push('/admin/companies')}
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
