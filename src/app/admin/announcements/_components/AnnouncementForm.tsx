'use client';

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
} from '@chakra-ui/react';
import { AnnouncementType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import { ChakraDateTimePicker } from '@/components/common/ChakraDateTimePicker';

interface IAnnouncementForm {
  message: string;
  type: AnnouncementType;
  expiresAt?: Date | null;
  isActive: boolean;
}

interface IAnnouncementFormProps {
  initialData?: Partial<IAnnouncementForm>;
  onSubmit: (data: IAnnouncementForm) => Promise<void>;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const AnnouncementForm = ({
  initialData,
  onSubmit,
  isLoading,
  mode = 'create',
}: IAnnouncementFormProps) => {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAnnouncementForm>({
    defaultValues: {
      message: initialData?.message || '',
      type: initialData?.type || AnnouncementType.INFO,
      expiresAt: initialData?.expiresAt
        ? new Date(initialData.expiresAt)
        : null,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmitForm = async (data: IAnnouncementForm) => {
    try {
      await onSubmit(data);
      toast({
        title: mode === 'create' ? 'Annonce créée' : 'Annonce mise à jour',
        status: 'success',
        duration: 3000,
      });
      router.push('/admin/announcements');
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
      <Stack spacing={6}>
        <FormControl isRequired isInvalid={!!errors.message}>
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

        <FormControl isRequired isInvalid={!!errors.type}>
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
            control={control}
            name='expiresAt'
            render={({ field: { onChange, value } }) => (
              <ChakraDateTimePicker
                minDate={new Date()}
                placeholderText="Sélectionner une date d'expiration"
                selectedDate={value || null}
                onChange={(date: Date | null) => onChange(date)}
              />
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Statut</FormLabel>
          <Select
            {...register('isActive', {
              setValueAs: (value: string) => value === 'true',
            })}
          >
            <option value='true'>Active</option>
            <option value='false'>Inactive</option>
          </Select>
        </FormControl>

        <HStack justify='flex-end' pt={4} spacing={4}>
          <Button
            variant='ghost'
            onClick={() => router.push('/admin/announcements')}
          >
            Annuler
          </Button>
          <Button colorScheme='blue' isLoading={isLoading} type='submit'>
            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default AnnouncementForm;
