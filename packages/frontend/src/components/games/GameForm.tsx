import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  VStack,
  Textarea,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { PlatformSelect } from '../platforms';
import { CompanySelect } from '../companies/CompanySelect';
import { useForm, Controller } from 'react-hook-form';
import { GameFormData } from '../../types/game';
import { ReleaseDateSelector } from './ReleaseDateSelector';

interface GameFormProps {
  initialData?: GameFormData;
  onSubmit: (data: GameFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const GameForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GameFormProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GameFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      releaseDate: initialData?.releaseDate,
      platformIds: initialData?.platformIds || [],
      publisherId: initialData?.publisherId || '',
      developerId: initialData?.developerId || '',
      coverImage: initialData?.coverImage || '',
    },
  });

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Titre</FormLabel>
              <Input
                {...register('title', {
                  required: 'Le titre est requis',
                })}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <Controller
              name="developerId"
              control={control}
              rules={{ required: 'Le développeur est requis' }}
              render={({ field }) => (
                <CompanySelect
                  label="Développeur"
                  type="developer"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.developerId?.message}
                  isRequired
                />
              )}
            />
          </GridItem>

          <GridItem>
            <Controller
              name="publisherId"
              control={control}
              rules={{ required: "L'éditeur est requis" }}
              render={({ field }) => (
                <CompanySelect
                  label="Éditeur"
                  type="publisher"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.publisherId?.message}
                  isRequired
                />
              )}
            />
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register('description', {
                  required: 'La description est requise',
                })}
                rows={4}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <ReleaseDateSelector
              control={control}
              errors={errors}
            />
          </GridItem>

          <GridItem>
            <Controller
              name="platformIds"
              control={control}
              rules={{ required: 'Au moins une plateforme est requise' }}
              render={({ field }) => (
                <PlatformSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.platformIds?.message}
                />
              )}
            />
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Image de couverture (optionnel)</FormLabel>
              <Input
                type="url"
                {...register('coverImage')}
                placeholder="URL de l'image"
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button onClick={onCancel} variant="outline">
            Annuler
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Enregistrement..."
          >
            {initialData ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
};
