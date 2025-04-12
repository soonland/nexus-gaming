'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import { ChakraDateTimePicker } from '@/components/common/ChakraDateTimePicker';
import type { PlatformForm as IPlatformForm } from '@/types';

interface IPlatformFormProps {
  initialData?: IPlatformForm;
  onSubmit: (data: IPlatformForm) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const PlatformForm = ({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: IPlatformFormProps) => {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IPlatformForm & { releaseDateTemp: Date | null }>({
    defaultValues: {
      name: initialData?.name || '',
      manufacturer: initialData?.manufacturer || '',
      releaseDateTemp: initialData?.releaseDate
        ? new Date(initialData.releaseDate)
        : null,
    },
  });

  const onSubmitForm = async (
    data: IPlatformForm & { releaseDateTemp: Date | null }
  ) => {
    const formData: IPlatformForm = {
      name: data.name,
      manufacturer: data.manufacturer,
      releaseDate: data.releaseDateTemp?.toISOString() || null,
    };
    try {
      await onSubmit(formData);
      toast({
        title:
          mode === 'create' ? 'Plateforme créée' : 'Plateforme mise à jour',
        status: 'success',
        duration: 3000,
      });
      router.push('/admin/platforms');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Nom</FormLabel>
          <Input
            {...register('name', { required: 'Le nom est requis' })}
            placeholder='Ex: PlayStation 5'
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.manufacturer}>
          <FormLabel>Fabricant</FormLabel>
          <Input
            {...register('manufacturer', {
              required: 'Le fabricant est requis',
            })}
            placeholder='Ex: Sony'
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date de sortie</FormLabel>
          <Controller
            control={control}
            name='releaseDateTemp'
            render={({ field: { onChange, value } }) => (
              <ChakraDateTimePicker
                minDate={undefined}
                placeholderText='Sélectionner une date de sortie'
                selectedDate={value}
                showTimeSelect={false}
                onChange={(date: Date | null) => onChange(date)}
              />
            )}
          />
        </FormControl>

        <Stack
          direction='row'
          justify='flex-end'
          pt={4}
          spacing={4}
          width='100%'
        >
          <Button
            variant='ghost'
            onClick={() => router.push('/admin/platforms')}
          >
            Annuler
          </Button>
          <Button colorScheme='blue' isLoading={isLoading} type='submit'>
            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PlatformForm;
