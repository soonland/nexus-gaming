'use client'

import { useState } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  useToast,
  Textarea,
  Select,
  Text,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useCompanies } from '@/hooks/useCompanies'
import PlatformSelect from './PlatformSelect'
import { ChakraDateTimePicker } from '@/components/common/ChakraDateTimePicker'

import type { GameForm as IGameForm } from '@/types'
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
  const router = useRouter()
  const toast = useToast()
  const { companies = [] } = useCompanies()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<IGameForm & { releaseDateTemp: Date | null }>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      releaseDateTemp: initialData?.releaseDate ? new Date(initialData.releaseDate) : null,
      coverImage: initialData?.coverImage || null,
      platformIds: initialData?.platformIds || [],
      developerId: initialData?.developerId || '',
      publisherId: initialData?.publisherId || '',
    }
  })

  const [inlineCreation, setInlineCreation] = useState<{
    show: boolean
    type: 'developer' | 'publisher'
  }>({ show: false, type: 'developer' })

  const developers = companies.filter(company => company.isDeveloper)
  const publishers = companies.filter(company => company.isPublisher)

  const onSubmitForm = async (data: IGameForm & { releaseDateTemp: Date | null }) => {
    const formData: IGameForm = {
      ...data,
      releaseDate: data.releaseDateTemp?.toISOString() || null
    }
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
    <Box as="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>Titre</FormLabel>
          <Input
            {...register('title', { required: 'Le titre est requis' })}
            placeholder="Ex: The Legend of Zelda: Tears of the Kingdom"
          />
          {errors.title && (
            <FormErrorMessage>{errors.title.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description')}
            placeholder="Description du jeu..."
            rows={5}
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.developerId}>
          <FormLabel>Développeur</FormLabel>
          <Select
            {...register('developerId', { required: 'Le développeur est requis' })}
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
                  setValue('developerId', newCompany.id)
                }
                setInlineCreation((prev) => ({ ...prev, show: false }))
              }}
              onCancel={() => setInlineCreation((prev) => ({ ...prev, show: false }))}
            />
          )}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.publisherId}>
          <FormLabel>Éditeur</FormLabel>
          <Select
            {...register('publisherId', { required: 'L\'éditeur est requis' })}
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
                  setValue('publisherId', newCompany.id)
                }
                setInlineCreation((prev) => ({ ...prev, show: false }))
              }}
              onCancel={() => setInlineCreation((prev) => ({ ...prev, show: false }))}
            />
          )}
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

        <FormControl>
          <FormLabel>Image de couverture</FormLabel>
          <Input
            {...register('coverImage')}
            placeholder="URL de l'image"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Plateformes</FormLabel>
          <PlatformSelect
            selectedIds={watch('platformIds')}
            onChange={(platformIds) => setValue('platformIds', platformIds)}
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
      </Stack>
    </Box>
  )
}
