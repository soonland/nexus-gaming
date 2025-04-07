'use client'

import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  useToast,
  Checkbox,
  Stack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useCompanies } from '@/hooks/useCompanies'

import type { CompanyData } from '@/types'

interface InlineCompanyCreationProps {
  type: 'developer' | 'publisher'
  onSuccess: (newCompany: CompanyData) => void
  onCancel: () => void
}

export default function InlineCompanyCreation({
  type,
  onSuccess,
  onCancel,
}: InlineCompanyCreationProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    isDeveloper: type === 'developer',
    isPublisher: type === 'publisher',
  })
  const [error, setError] = React.useState<string | null>(null)
  const toast = useToast()
  const { createCompany, isCreating } = useCompanies()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (isCreating) return
    
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      setError('Le nom est requis')
      return
    }
    
    if (!formData.isDeveloper && !formData.isPublisher) {
      setError('Sélectionnez au moins un rôle')
      return
    }
    
    setError(null)

    try {
      createCompany(
        {
          name: trimmedName,
          isDeveloper: formData.isDeveloper,
          isPublisher: formData.isPublisher,
        },
        {
          onSuccess: (newCompany) => {
            toast({
              title: 'Société créée',
              status: 'success',
              duration: 3000,
            })
            onSuccess(newCompany)
          },
          onError: () => {
            toast({
              title: 'Erreur',
              description: 'Impossible de créer la société',
              status: 'error',
              duration: 5000,
            })
          },
        }
      )
    } catch (error) {
      console.error('Error creating company:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <Box mt={2}>
      <VStack spacing={2} align="stretch">
        <FormControl isInvalid={!!error}>
          <Input
            ref={inputRef}
            placeholder="Nom de la société"
            size="sm"
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }))
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            isDisabled={isCreating}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>

        <Stack direction="row" spacing={4}>
          <Checkbox
            size="sm"
            isChecked={formData.isDeveloper}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, isDeveloper: e.target.checked }))
              setError(null)
            }}
            isDisabled={isCreating}
          >
            Développeur
          </Checkbox>
          <Checkbox
            size="sm"
            isChecked={formData.isPublisher}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, isPublisher: e.target.checked }))
              setError(null)
            }}
            isDisabled={isCreating}
          >
            Éditeur
          </Checkbox>
        </Stack>

        <HStack justify="flex-end">
          <IconButton
            aria-label="Valider"
            icon={<CheckIcon />}
            size="sm"
            colorScheme="green"
            onClick={() => handleSubmit()}
            isLoading={isCreating}
            isDisabled={!formData.name.trim()}
          />
          <IconButton
            aria-label="Annuler"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={onCancel}
            isDisabled={isCreating}
          />
        </HStack>
      </VStack>
    </Box>
  )
}
