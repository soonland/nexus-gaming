'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface ICategoryFormProps {
  initialData?: {
    name: string;
  };
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode = 'create',
}: ICategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  const onSubmitForm = async (data: { name: string }) => {
    await onSubmit(data);
  };

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Nom</FormLabel>
          <Input
            {...register('name', { required: 'Le nom est requis' })}
            placeholder='Nom de la catégorie'
          />
          {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>

        <Stack
          direction='row'
          justify='flex-end'
          pt={4}
          spacing={4}
          width='100%'
        >
          <Button variant='ghost' onClick={onCancel}>
            Annuler
          </Button>
          <Button
            colorScheme='blue'
            isLoading={isLoading}
            loadingText={
              mode === 'create' ? 'Création...' : 'Enregistrement...'
            }
            type='submit'
          >
            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
