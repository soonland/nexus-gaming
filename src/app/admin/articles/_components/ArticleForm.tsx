'use client';

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Backdrop, Box, Stack, Typography } from '@mui/material';
import { ArticleStatus } from '@prisma/client';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useGames } from '@/hooks/useGames';
import { useUsers } from '@/hooks/useUsers';
import dayjs from '@/lib/dayjs';
import { canSelectArticleAuthor } from '@/lib/permissions';
import { uploadImage } from '@/lib/upload/client';

import {
  ArticleMainContent,
  ArticleMetadataPanel,
  type ArticleWithRelations,
  type IArticleFormData,
} from './form';

interface IArticleFormProps {
  initialData?: ArticleWithRelations;
  mode: 'create' | 'edit';
}

export const ArticleForm = ({ initialData, mode }: IArticleFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [gameIds, setGameIds] = useState<string[]>(
    initialData?.games?.map(game => game.id) || []
  );
  const [status, setStatus] = useState<ArticleStatus>(
    initialData?.status || ArticleStatus.DRAFT
  );
  const [publishedAt, setPublishedAt] = useState<Dayjs | null>(
    initialData?.publishedAt ? dayjs(initialData.publishedAt) : dayjs()
  );
  const [updatedAt, setUpdatedAt] = useState<Dayjs | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(
    initialData?.heroImage || null
  );
  const [userId, setUserId] = useState(initialData?.userId || '');

  useEffect(() => {
    if (mode === 'create' && !userId) {
      setUserId(user?.id || '');
    }
  }, [mode, userId, user]);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { createArticle, updateArticle } = useAdminArticles();
  const { categories } = useCategories();
  const { games } = useGames();
  const { data: usersData } = useUsers();
  const { showSuccess, showError } = useNotifier();

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Le titre est requis');
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError('Le titre doit contenir au moins 3 caractères');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!content.trim()) {
      setContentError('Le contenu est requis');
      isValid = false;
    } else {
      setContentError('');
    }

    if (!categoryId) {
      setCategoryError('La catégorie est requise');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'articles');
      const imageUrl = result.secure_url;
      setHeroImage(imageUrl);
      showSuccess('Image mise à jour avec succès');
    } catch (error) {
      console.error('Error uploading image:', error);
      showError("Erreur lors du téléchargement de l'image");
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
      const data: IArticleFormData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        gameIds,
        status,
        publishedAt: publishedAt?.toISOString() || null,
        updatedAt: updatedAt?.toISOString() || null,
        heroImage,
        userId,
      };

      if (mode === 'create') {
        await createArticle.mutateAsync(data);
        showSuccess('Article créé avec succès');
      } else if (initialData?.id) {
        await updateArticle.mutateAsync({
          id: initialData.id,
          data,
        });
        showSuccess('Article modifié avec succès');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (error) {
      console.error('Error saving article:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/articles'
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: 'flex', position: 'relative', minHeight: '70vh' }}>
        {/* Main Content */}
        <ArticleMainContent
          content={content}
          contentError={contentError}
          title={title}
          titleError={titleError}
          onContentChange={setContent}
          onTitleChange={setTitle}
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
              'bgcolor': isMetadataOpen ? 'primary.main' : 'primary.light',
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
                  sx={{
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
              ) : (
                <ChevronLeftIcon
                  sx={{
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
              )}
            </Stack>
          </Box>

          <ArticleMetadataPanel
            canSelectArticleAuthor={canSelectArticleAuthor(user?.role)}
            categories={categories}
            categoryError={categoryError}
            categoryId={categoryId}
            gameIds={gameIds}
            games={games}
            heroImage={heroImage}
            isOpen={isMetadataOpen}
            isUploading={isUploading}
            publishedAt={publishedAt}
            status={status}
            updatedAt={updatedAt}
            userId={userId}
            users={usersData?.users}
            onCategoryChange={setCategoryId}
            onClose={() => setIsMetadataOpen(false)}
            onGamesChange={setGameIds}
            onImageChange={handleImageChange}
            onPublishedAtChange={setPublishedAt}
            onStatusChange={setStatus}
            onUpdatedAtChange={setUpdatedAt}
            onUserChange={setUserId}
          />
        </Box>
      </Box>
    </AdminForm>
  );
};
