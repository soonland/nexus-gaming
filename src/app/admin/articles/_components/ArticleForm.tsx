'use client';

import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material';
import { ArticleStatus, Role } from '@prisma/client';
import type { Dayjs } from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiChevronsLeft as ChevronLeftIcon, FiSave } from 'react-icons/fi';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useGames } from '@/hooks/useGames';
import { useUsers } from '@/hooks/useUsers';
import dayjs from '@/lib/dayjs';
import { canSelectArticleAuthor, canEditArticle } from '@/lib/permissions';

import {
  ArticleMainContent,
  ArticleMetadataPanel,
  type IArticleWithRelations,
  type IArticleFormData,
} from './form';
import { SubmitButton } from './SubmitButton';

interface IArticleFormProps {
  initialData?: IArticleWithRelations;
  mode: 'create' | 'edit';
}

export const ArticleForm = ({ initialData, mode }: IArticleFormProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
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
  const [userId, setUserId] = useState(initialData?.user.id || '');

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

  const { createArticle, updateArticle, updateArticleStatus } =
    useAdminArticles();
  const { categories } = useCategories();
  const isEditor = user?.role === Role.EDITOR;
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

  const handleStatusChange = async (
    newStatus: ArticleStatus,
    comment?: string
  ) => {
    if (!initialData?.id) return;

    try {
      await updateArticleStatus.mutateAsync({
        id: initialData.id,
        status: newStatus,
        comment,
      });
      setStatus(newStatus);
      showSuccess('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleEditorSubmit = async (comment: string) => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data: IArticleFormData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        gameIds,
        status: 'PENDING_APPROVAL',
        publishedAt: null,
        updatedAt: null,
        heroImage,
        userId,
      };

      if (mode === 'create') {
        await createArticle.mutateAsync(data);
        showSuccess('Article soumis pour approbation');
      } else if (initialData?.id) {
        await updateArticle.mutateAsync({
          id: initialData.id,
          data,
        });
        if (comment) {
          await updateArticleStatus.mutateAsync({
            id: initialData.id,
            status: 'PENDING_APPROVAL',
            comment,
          });
        }
        showSuccess('Article soumis pour approbation');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (error) {
      console.error('Error submitting article:', error);
      showError('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, stayOnPage = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data: IArticleFormData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        gameIds,
        status: isEditor ? ArticleStatus.DRAFT : status,
        publishedAt: isEditor ? null : publishedAt?.toISOString() || null,
        updatedAt: updatedAt?.toISOString() || null,
        heroImage,
        userId,
      };

      if (mode === 'create') {
        await createArticle.mutateAsync(data);
        showSuccess(
          isEditor
            ? 'Brouillon sauvegardé avec succès'
            : 'Article créé avec succès'
        );
      } else if (initialData?.id) {
        await updateArticle.mutateAsync({
          id: initialData.id,
          data,
        });
        showSuccess(
          isEditor
            ? 'Brouillon mis à jour avec succès'
            : 'Article modifié avec succès'
        );
      }

      if (!stayOnPage) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        showSuccess('Article sauvegardé avec succès');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (
      initialData &&
      !canEditArticle(
        user?.role,
        {
          status: initialData.status,
          userId: initialData.user.id,
        },
        user?.id
      )
    ) {
      router.push('/admin/articles');
    }
  }, [initialData, user, router]);

  const renderFormActions = () => {
    if (isEditor) {
      return (
        <Stack direction='row' spacing={2}>
          <ButtonGroup variant='outlined'>
            <Button color='inherit' component={Link} href='/admin/articles'>
              Annuler
            </Button>
            <Button disabled={isSubmitting} type='submit' value='save-continue'>
              Sauvegarder et continuer
            </Button>
            <Button
              color='primary'
              disabled={isSubmitting}
              startIcon={<FiSave />}
              type='submit'
              variant='contained'
            >
              Sauvegarder
            </Button>
          </ButtonGroup>
          <SubmitButton disabled={isSubmitting} onSubmit={handleEditorSubmit} />
        </Stack>
      );
    }

    return (
      <ButtonGroup variant='outlined'>
        <Button color='inherit' component={Link} href='/admin/articles'>
          Annuler
        </Button>
        <Button disabled={isSubmitting} type='submit' value='save-continue'>
          Sauvegarder et continuer
        </Button>
        <Button
          color='primary'
          disabled={isSubmitting}
          startIcon={<FiSave />}
          type='submit'
          variant='contained'
        >
          Sauvegarder
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <AdminForm
      errors={[
        ...(titleError ? [{ field: 'Titre', message: titleError }] : []),
        ...(contentError ? [{ field: 'Contenu', message: contentError }] : []),
        ...(categoryError
          ? [{ field: 'Catégorie', message: categoryError }]
          : []),
      ]}
      hideSaveButton={true}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      submitButton={renderFormActions()}
      onSubmit={e => {
        const submitButton = (e.nativeEvent as SubmitEvent)
          .submitter as HTMLButtonElement;
        handleSubmit(e, submitButton?.value === 'save-continue');
      }}
    >
      <Box sx={{ display: 'flex', position: 'relative', minHeight: '70vh' }}>
        <ArticleMainContent
          content={content}
          contentError={contentError}
          title={title}
          titleError={titleError}
          onContentChange={setContent}
          onTitleChange={setTitle}
        />

        <Backdrop
          open={isMetadataOpen}
          sx={{
            zIndex: 9,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => setIsMetadataOpen(false)}
        />
        <Box
          sx={{
            bottom: 0,
            position: 'fixed',
            right: 0,
            top: 0,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              'alignItems': 'center',
              'bgcolor': isMetadataOpen ? 'primary.main' : 'primary.light',
              'borderRadius': '0 0 8px 8px',
              'boxShadow': 2,
              'color': 'white',
              'cursor': 'pointer',
              'display': 'flex',
              'height': '40px',
              'justifyContent': 'center',
              'position': 'absolute',
              'right': isMetadataOpen ? '350px' : 0,
              'top': '50%',
              'transform': 'translateY(-50%) translateX(140px) rotate(90deg)',
              'transformOrigin': 'left center',
              'transition': 'all 0.2s ease-in-out',
              'width': '160px',
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
              sx={{ transform: 'rotate(-180deg)' }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                Métadonnées
              </Typography>
              <ChevronLeftIcon
                style={{
                  transform: isMetadataOpen
                    ? 'rotate(-90deg)'
                    : 'rotate(90deg)',
                  transition: 'transform 0.2s ease-in-out',
                }}
              />
            </Stack>
          </Box>

          <ArticleMetadataPanel
            approvalHistory={initialData?.approvalHistory}
            canSelectArticleAuthor={canSelectArticleAuthor(user?.role)}
            categories={categories || []}
            categoryError={categoryError}
            categoryId={categoryId}
            gameIds={gameIds}
            games={games}
            heroImage={heroImage}
            isLoading={isLoading}
            isOpen={isMetadataOpen}
            isUploading={isUploading}
            publishedAt={publishedAt}
            status={status}
            updatedAt={updatedAt}
            userId={userId}
            userRole={user?.role}
            users={usersData?.users}
            onCategoryChange={setCategoryId}
            onClose={() => setIsMetadataOpen(false)}
            onGamesChange={setGameIds}
            onImageChange={async e => {
              setIsUploading(true);
              try {
                const file = e.target.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  const data = await response.json();
                  setHeroImage(data.url);
                  showSuccess('Image mise à jour avec succès');
                }
              } catch (error) {
                console.error('Error uploading image:', error);
                showError("Erreur lors du téléchargement de l'image");
              } finally {
                setIsUploading(false);
              }
            }}
            onPublishedAtChange={setPublishedAt}
            onStatusChange={handleStatusChange}
            onUpdatedAtChange={setUpdatedAt}
            onUserChange={setUserId}
          />
        </Box>
      </Box>
    </AdminForm>
  );
};
