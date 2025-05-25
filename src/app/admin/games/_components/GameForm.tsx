'use client';

import { Backdrop, Box, Stack, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FiChevronsLeft as ChevronLeftIcon,
  FiChevronsRight as ChevronRightIcon,
} from 'react-icons/fi';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useCompanies } from '@/hooks/useCompanies';
import { useCreateGame, useUpdateGame } from '@/hooks/useGames';
import { usePlatforms } from '@/hooks/usePlatforms';
import dayjs from '@/lib/dayjs';
import { uploadImage } from '@/lib/upload/client';
import type { IGameForm, GameGenre } from '@/types/api';

import {
  GameMainContent,
  GameMetadataPanel,
  type IGameWithRelations,
} from './form';
import { QuickCompanyDialog } from './QuickCompanyDialog';

interface IGameFormProps {
  initialData?: IGameWithRelations;
  mode: 'create' | 'edit';
}

export const GameForm = ({ initialData, mode }: IGameFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [developerId, setDeveloperId] = useState(
    initialData?.developer?.id || ''
  );
  const [developerError, setDeveloperError] = useState('');
  const [publisherId, setPublisherId] = useState(
    initialData?.publisher?.id || ''
  );
  const [publisherError, setPublisherError] = useState('');
  const [platformIds, setPlatformIds] = useState<string[]>(
    initialData?.platforms
      ?.map(platform => platform.id)
      .filter((id): id is string => id !== undefined) || []
  );
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(
    initialData?.releaseDate ? dayjs(initialData.releaseDate) : null
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [genre, setGenre] = useState<GameGenre | null>(
    initialData?.genre || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [quickCompanyDialog, setQuickCompanyDialog] = useState<{
    isOpen: boolean;
    role?: 'developer' | 'publisher';
  }>({ isOpen: false });

  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const { showSuccess, showError } = useNotifier();

  // Load companies and platforms
  const { companies: developers } = useCompanies({
    role: 'developer',
    limit: 100,
  });
  const { companies: publishers } = useCompanies({
    role: 'publisher',
    limit: 100,
  });
  const { platforms } = usePlatforms({
    page: 1,
    limit: 100,
  });

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Le titre est requis');
      isValid = false;
    } else if (title.trim().length < 2) {
      setTitleError('Le titre doit contenir au moins 2 caractères');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!developerId) {
      setDeveloperError('Le développeur est requis');
      isValid = false;
    } else {
      setDeveloperError('');
    }

    if (!publisherId) {
      setPublisherError("L'éditeur est requis");
      isValid = false;
    } else {
      setPublisherError('');
    }

    return isValid;
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'games');
      if (!result.public_id) {
        throw new Error('No public_id in upload response');
      }

      const previousImage = coverImage;
      setCoverImage(result.public_id);

      if (mode === 'edit' && initialData?.id) {
        try {
          // Mise à jour partielle avec PATCH
          const updated = await updateGame.updatePartial.mutateAsync({
            id: initialData.id,
            data: {
              coverImage: result.public_id,
            },
          });

          if (updated.coverImage !== result.public_id) {
            throw new Error('Cover image not updated in response');
          }
          showSuccess('Image mise à jour avec succès');
        } catch (error) {
          // Rollback en cas d'erreur
          setCoverImage(previousImage);
          throw error;
        }
      }
      showSuccess('Image mise à jour avec succès');
    } catch (error) {
      console.error('Error uploading image:', error);
      showError("Une erreur est survenue lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data: IGameForm = {
        title: title.trim(),
        description: description.trim() || null,
        releaseDate: releaseDate?.format('YYYY-MM-DD') || null,
        coverImage: coverImage || null,
        genre: genre || null,
        platformIds,
        developerId,
        publisherId,
      };

      if (mode === 'create') {
        await createGame.mutateAsync(data);
        showSuccess('Jeu créé avec succès');
      } else if (initialData?.id) {
        await updateGame.mutateAsync({ id: initialData.id, data });
        showSuccess('Jeu modifié avec succès');
      }

      router.push('/admin/games');
      router.refresh();
    } catch (error) {
      console.error('Error saving game:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/games'
      isSubmitting={isSubmitting || isUploading}
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: 'flex', position: 'relative', minHeight: '70vh' }}>
        {quickCompanyDialog.isOpen && (
          <QuickCompanyDialog
            defaultRole={quickCompanyDialog.role}
            isOpen={true}
            onClose={() => setQuickCompanyDialog({ isOpen: false })}
            onSuccess={newCompany => {
              if (
                newCompany.isDeveloper &&
                quickCompanyDialog.role === 'developer'
              ) {
                setDeveloperId(newCompany.id);
              }
              if (
                newCompany.isPublisher &&
                quickCompanyDialog.role === 'publisher'
              ) {
                setPublisherId(newCompany.id);
              }
            }}
          />
        )}

        {/* Main Content */}
        <GameMainContent
          description={description}
          slug={slug}
          title={title}
          titleError={titleError}
          onDescriptionChange={setDescription}
          onTitleChange={value => {
            setTitle(value);
            setSlug(value);
          }}
        />

        {/* Metadata Panel */}
        <Backdrop
          open={isMetadataOpen}
          sx={{
            zIndex: 9,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => setIsMetadataOpen(false)}
        />
        <Box
          sx={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 10 }}
        >
          {/* Vertical Tab */}
          <Box
            sx={{
              'position': 'absolute',
              'right': isMetadataOpen ? '350px' : 0,
              'top': '50%',
              'width': '160px',
              'height': '40px',
              'transform': 'translateY(-50%) translateX(140px) rotate(90deg)',
              'transformOrigin': 'left center',
              'display': 'flex',
              'alignItems': 'center',
              'justifyContent': 'center',
              'bgcolor': 'primary.dark',
              'color': 'white',
              'borderRadius': '0 0 8px 8px',
              'cursor': 'pointer',
              'transition': 'all 0.2s ease-in-out',
              'boxShadow': 2,
              'zIndex': 2,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={() => setIsMetadataOpen(!isMetadataOpen)}
          >
            <Stack
              alignItems='center'
              direction='row'
              spacing={1}
              sx={{
                'transform': 'rotate(-180deg)',
                '& svg': {
                  fontSize: '1.2rem',
                },
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                Métadonnées
              </Typography>
              {isMetadataOpen ? (
                <ChevronRightIcon
                  style={{
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
              ) : (
                <ChevronLeftIcon
                  style={{
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
              )}
            </Stack>
          </Box>

          <GameMetadataPanel
            coverImage={coverImage}
            developerError={developerError}
            developerId={developerId}
            developers={developers}
            genre={genre}
            isOpen={isMetadataOpen}
            isUploading={isUploading}
            platformIds={platformIds}
            platforms={platforms}
            publisherError={publisherError}
            publisherId={publisherId}
            publishers={publishers}
            releaseDate={releaseDate}
            onDeveloperChange={setDeveloperId}
            onGenreChange={setGenre}
            onImageChange={handleImageChange}
            onPlatformsChange={setPlatformIds}
            onPublisherChange={setPublisherId}
            onQuickCompanyCreate={role =>
              setQuickCompanyDialog({ isOpen: true, role })
            }
            onReleaseDateChange={setReleaseDate}
          />
        </Box>
      </Box>
    </AdminForm>
  );
};
