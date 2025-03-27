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
  HStack,
  Grid,
  GridItem,
  Badge,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { GameFormData } from '../../types/game';

const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

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
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GameFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      releaseDate: '',
      platform: [],
      publisher: '',
      developer: '',
    },
  });

  const selectedPlatforms = watch('platform');

  const handlePlatformToggle = (platform: string) => {
    const current = selectedPlatforms || [];
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    setValue('platform', updated);
  };

  const onFormSubmit = async (data: GameFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: initialData ? 'Jeu mis à jour' : 'Jeu créé',
        status: 'success',
        duration: 3000,
      });
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
    <Box
      as="form"
      onSubmit={handleSubmit(onFormSubmit)}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <FormControl isInvalid={!!errors.title}>
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
            <FormControl isInvalid={!!errors.developer}>
              <FormLabel>Développeur</FormLabel>
              <Input
                {...register('developer', {
                  required: 'Le développeur est requis',
                })}
              />
              <FormErrorMessage>
                {errors.developer && errors.developer.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.publisher}>
              <FormLabel>Éditeur</FormLabel>
              <Input
                {...register('publisher', {
                  required: "L'éditeur est requis",
                })}
              />
              <FormErrorMessage>
                {errors.publisher && errors.publisher.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl isInvalid={!!errors.description}>
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
            <FormControl isInvalid={!!errors.releaseDate}>
              <FormLabel>Date de sortie</FormLabel>
              <Input
                type="date"
                {...register('releaseDate', {
                  required: 'La date de sortie est requise',
                })}
              />
              <FormErrorMessage>
                {errors.releaseDate && errors.releaseDate.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.platform}>
              <FormLabel>Plateformes</FormLabel>
              <Controller
                name="platform"
                control={control}
                rules={{ required: 'Au moins une plateforme est requise' }}
                render={() => (
                  <HStack spacing={2} wrap="wrap">
                    {PLATFORMS.map((platform) => (
                      <Badge
                        key={platform}
                        borderRadius="full"
                        px={3}
                        py={1}
                        cursor="pointer"
                        onClick={() => handlePlatformToggle(platform)}
                        colorScheme={
                          selectedPlatforms?.includes(platform) ? 'teal' : 'gray'
                        }
                      >
                        {platform}
                      </Badge>
                    ))}
                  </HStack>
                )}
              />
              <FormErrorMessage>
                {errors.platform && errors.platform.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Image de couverture</FormLabel>
              <Input
                type="url"
                {...register('coverImage')}
                placeholder="URL de l'image (optionnel)"
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
