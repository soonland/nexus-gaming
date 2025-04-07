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
} from '@chakra-ui/react'

interface CompanyFormData {
  name: string
  isDeveloper: boolean
  isPublisher: boolean
}

interface CompanyFormProps {
  initialData?: CompanyFormData
  onSubmit: (data: CompanyFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: CompanyFormProps) {
  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: initialData?.name || '',
    isDeveloper: initialData?.isDeveloper || false,
    isPublisher: initialData?.isPublisher || false,
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      return
    }

    if (!formData.isDeveloper && !formData.isPublisher) {
      return
    }

    await onSubmit(formData)
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
              onClick={onCancel}
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
