'use client'

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { ChakraDateTimePicker } from '@/components/common/ChakraDateTimePicker'

import type { PlatformForm as IPlatformForm } from '@/types'

interface PlatformFormProps {
  initialData?: IPlatformForm
  onSubmit: (data: IPlatformForm) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function PlatformForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: PlatformFormProps) {
  const router = useRouter()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IPlatformForm & { releaseDateTemp: Date | null }>({
    defaultValues: {
      name: initialData?.name || '',
      manufacturer: initialData?.manufacturer || '',
      releaseDateTemp: initialData?.releaseDate ? new Date(initialData.releaseDate) : null,
    }
  })

  const onSubmitForm = async (data: IPlatformForm & { releaseDateTemp: Date | null }) => {
    const formData: IPlatformForm = {
      name: data.name,
      manufacturer: data.manufacturer,
      releaseDate: data.releaseDateTemp?.toISOString() || null,
    }
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
    <Box as="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Nom</FormLabel>
              <Input
                {...register('name', { required: 'Le nom est requis' })}
                placeholder="Ex: PlayStation 5"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.manufacturer}>
              <FormLabel>Fabricant</FormLabel>
              <Input
                {...register('manufacturer', { required: 'Le fabricant est requis' })}
                placeholder="Ex: Sony"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Date de sortie</FormLabel>
              <Controller
                name="releaseDateTemp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ChakraDateTimePicker
                    selectedDate={value}
                    onChange={(date: Date | null) => onChange(date)}
                    showTimeSelect={false}
                    minDate={undefined}
                    placeholderText="Sélectionner une date de sortie"
                  />
                )}
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
      </Stack>
    </Box>
  )
}
