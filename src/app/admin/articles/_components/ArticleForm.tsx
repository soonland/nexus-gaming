'use client';

import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  HStack,
  useToast,
  Select,
  Image,
  IconButton,
} from '@chakra-ui/react';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ImageUpload } from '@/components/common/ImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { deleteImage } from '@/lib/upload';
import type { ArticleForm as IArticleForm, ArticleStatus } from '@/types';

import GameSelector from './GameSelector';

const getAvailableStatuses = (role?: Role): ArticleStatus[] => {
  switch (role) {
    case 'SYSADMIN':
    case 'ADMIN':
      return ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'ARCHIVED'];
    case 'MODERATOR':
      return ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED'];
    case 'USER':
    default:
      return ['DRAFT', 'PENDING_APPROVAL'];
  }
};

interface IArticleFormProps {
  initialData?: Partial<IArticleForm> & { user?: { username: string } };
  onSubmit: (data: IArticleForm) => Promise<void>;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const ArticleForm = ({
  initialData,
  onSubmit,
  isLoading,
  mode = 'create',
}: IArticleFormProps) => {
  const [heroImage, setHeroImage] = useState<string | null>(
    initialData?.heroImage || null
  );
  const router = useRouter();
  const toast = useToast();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { user } = useAuth();
  const availableStatuses = getAvailableStatuses(user?.role);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IArticleForm>({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      categoryId: initialData?.categoryId || '',
      gameIds: initialData?.gameIds ?? [],
      status: initialData?.status || 'DRAFT',
      publishedAt: initialData?.publishedAt,
    },
  });

  const status = watch('status');
  const gameIds = watch('gameIds') ?? [];

  // Vérification si le statut actuel est autorisé
  useEffect(() => {
    if (status && !availableStatuses.includes(status)) {
      setValue('status', 'DRAFT');
    }
  }, [status, availableStatuses, setValue]);

  // Mise à jour de la catégorie quand les catégories sont chargées
  useEffect(() => {
    if (!isCategoriesLoading && categories && initialData?.categoryId) {
      const categoryExists = categories?.some(
        category => category.id === initialData.categoryId
      );
      if (categoryExists) {
        setValue('categoryId', initialData.categoryId);
      }
    }
  }, [categories, isCategoriesLoading, initialData?.categoryId, setValue]);

  const handleImageUpload = async (url: string) => {
    // Si on a une image existante, on la supprime
    if (heroImage) {
      const oldPublicId = heroImage.split('/').pop()?.split('.')[0];
      if (oldPublicId) {
        fetch(
          `/api/upload/delete?public_id=${encodeURIComponent(oldPublicId)}`,
          {
            method: 'DELETE',
          }
        ).catch(console.error);
      }
    }
    setHeroImage(url);
  };

  const handleImageDelete = async () => {
    if (heroImage) {
      const publicId = heroImage.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteImage(publicId);
        setHeroImage(null);
      }
    }
  };

  const onSubmitForm = async (data: IArticleForm) => {
    try {
      // Si l'article est publié et qu'il n'y a pas de date de publication, on la définit
      if (data.status === 'PUBLISHED' && !data.publishedAt) {
        data.publishedAt = new Date().toISOString();
      }

      data.heroImage = heroImage;
      await onSubmit(data);
      toast({
        title: mode === 'create' ? 'Article créé' : 'Article mis à jour',
        status: 'success',
        duration: 3000,
      });
      router.push('/admin/articles');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';

      toast({
        title: 'Erreur',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });

      // Si c'est une erreur d'authentification, rediriger vers la page de login
      if (errorMessage.includes('connecté')) {
        router.push('/login');
      }
    }
  };

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={6}>
        <HStack spacing={4} width='100%'>
          {/* Champ auteur en lecture seule */}
          <FormControl flex='1'>
            <FormLabel>Auteur</FormLabel>
            <Input
              isReadOnly
              _dark={{ bg: 'gray.700' }}
              bg='gray.50'
              value={
                mode === 'create' ? user?.username : initialData?.user?.username
              }
            />
            <FormHelperText>&nbsp;</FormHelperText>
          </FormControl>

          <FormControl flex='1' isInvalid={!!errors.categoryId}>
            <FormLabel>Catégorie</FormLabel>
            <Select
              {...register('categoryId', {
                required: 'La catégorie est requise',
              })}
              isDisabled={isCategoriesLoading}
              placeholder={
                isCategoriesLoading
                  ? 'Chargement...'
                  : 'Sélectionner une catégorie'
              }
            >
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {errors.categoryId ? (
              <FormErrorMessage>{errors.categoryId.message}</FormErrorMessage>
            ) : (
              <FormHelperText>&nbsp;</FormHelperText>
            )}
          </FormControl>

          <FormControl flex='1'>
            <FormLabel>Statut de l'article</FormLabel>
            <Select
              value={status}
              onChange={e => {
                setValue('status', e.target.value as ArticleStatus);
                if (e.target.value === 'PUBLISHED' && !watch('publishedAt')) {
                  setValue('publishedAt', new Date().toISOString());
                }
              }}
            >
              {availableStatuses.includes('DRAFT') && (
                <option value='DRAFT'>🔸 Brouillon</option>
              )}
              {availableStatuses.includes('PENDING_APPROVAL') && (
                <option value='PENDING_APPROVAL'>
                  🔶 En attente d'approbation
                </option>
              )}
              {availableStatuses.includes('PUBLISHED') && (
                <option value='PUBLISHED'>🟢 Publié</option>
              )}
              {availableStatuses.includes('ARCHIVED') && (
                <option value='ARCHIVED'>⚪ Archivé</option>
              )}
            </Select>
            <FormHelperText>
              {status === 'DRAFT' && "L'article n'est visible que par vous"}
              {status === 'PENDING_APPROVAL' &&
                'En attente de validation par un modérateur'}
              {status === 'PUBLISHED' && "L'article est visible publiquement"}
              {status === 'ARCHIVED' && "L'article n'est plus visible"}
            </FormHelperText>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Image hero</FormLabel>
          <Box position='relative'>
            <ImageUpload
              folder='articles'
              preview={false}
              onUpload={(url: string) => handleImageUpload(url)}
            />
            {heroImage && (
              <Box mt={4} position='relative' width='fit-content'>
                <Image
                  alt='Hero preview'
                  height='200px'
                  objectFit='cover'
                  src={heroImage}
                  width='300px'
                />
                <IconButton
                  aria-label='Remove image'
                  colorScheme='red'
                  icon={<CloseIcon />}
                  position='absolute'
                  right={2}
                  size='sm'
                  top={2}
                  onClick={handleImageDelete}
                />
              </Box>
            )}
          </Box>
          <FormHelperText>Format JPG ou PNG recommandé</FormHelperText>
        </FormControl>

        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Titre</FormLabel>
          <Input
            {...register('title', { required: 'Le titre est requis' })}
            placeholder="Titre de l'article"
          />
          {errors.title && (
            <FormErrorMessage>{errors.title.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.content}>
          <FormLabel>Contenu</FormLabel>
          <Textarea
            {...register('content', { required: 'Le contenu est requis' })}
            minH='300px'
            placeholder="Contenu de l'article"
          />
          {errors.content && (
            <FormErrorMessage>{errors.content.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Jeux associés</FormLabel>
          <GameSelector
            selectedIds={gameIds}
            onChange={ids => setValue('gameIds', ids)}
          />
        </FormControl>

        <HStack justify='flex-end' pt={4} spacing={4}>
          <Button
            variant='ghost'
            onClick={() => router.push('/admin/articles')}
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

export default ArticleForm;
