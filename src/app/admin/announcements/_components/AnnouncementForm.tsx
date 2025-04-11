'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Textarea,
  HStack,
  Select,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { AnnouncementType } from '@prisma/client'
import { ChakraDateTimePicker } from '@/components/common/ChakraDateTimePicker'

interface AnnouncementForm {
  message: string
  type: AnnouncementType
  expiresAt?: Date | null
  isActive: boolean
}

interface AnnouncementFormProps {
  initialData?: Partial<AnnouncementForm>
  onSubmit: (data: AnnouncementForm) => Promise<void>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export default function AnnouncementForm({
  initialData,
  onSubmit,
  isLoading,
  mode = 'create',
}: AnnouncementFormProps) {
  const router = useRouter()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    defaultValues: {
      message: initialData?.message || '',
      type: initialData?.type || AnnouncementType.INFO,
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt) : null,
      isActive: initialData?.isActive ?? true,
    },
  })

  const onSubmitForm = async (data: AnnouncementForm) => {
    try {
      await onSubmit(data)
      toast({
        title: mode === 'create' ? 'Annonce créée' : 'Annonce mise à jour',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/announcements')
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
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.message} isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
            {...register('message', { required: 'Le message est requis' })}
            placeholder="Message de l'annonce"
            rows={4}
          />
          {errors.message && (
            <FormErrorMessage>{errors.message.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.type} isRequired>
          <FormLabel>Type</FormLabel>
          <Select {...register('type', { required: 'Le type est requis' })}>
            <option value={AnnouncementType.INFO}>Information</option>
            <option value={AnnouncementType.ATTENTION}>Attention</option>
            <option value={AnnouncementType.URGENT}>Urgent</option>
          </Select>
          {errors.type && (
            <FormErrorMessage>{errors.type.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Date d'expiration (optionnelle)</FormLabel>
          <Controller
            name="expiresAt"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ChakraDateTimePicker
                selectedDate={value || null}
                onChange={(date: Date | null) => onChange(date)}
                minDate={new Date()}
                placeholderText="Sélectionner une date d'expiration"
              />
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Statut</FormLabel>
          <Select 
            {...register('isActive', { 
              setValueAs: (value: string) => value === 'true'
            })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </FormControl>

        <HStack justify="flex-end" spacing={4} pt={4}>
          <Button
            onClick={() => router.push('/admin/announcements')}
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
    </Box>
  )
}
