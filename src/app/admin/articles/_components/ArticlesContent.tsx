'use client';

import { Button, Stack } from '@mui/material';
import { ArticleStatus } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FiCheck, FiEyeOff, FiTrash2 } from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminFilters,
  defaultActions,
} from '@/components/admin';
import type { IStatusOption } from '@/components/admin/common/AdminFilters';
import { ColorDot, useNotifier } from '@/components/common';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';
import {
  canDeleteArticles,
  canPublishArticles,
  canEditArticle,
  hasSufficientRole,
} from '@/lib/permissions';
import type { IArticleData } from '@/types';

import { getStatusStyle } from './articleStyles';

type ArticleSortField = keyof Pick<
  IArticleData,
  'title' | 'createdAt' | 'updatedAt' | 'status'
>;

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

interface IDeleteDialogState {
  isOpen: boolean;
  articleId: string | null;
  isBatchDelete: boolean;
}

const STATUS_OPTIONS: IStatusOption<'all' | ArticleStatus>[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: ArticleStatus.DRAFT, label: 'Brouillon' },
  { value: ArticleStatus.PENDING_APPROVAL, label: 'En attente' },
  { value: ArticleStatus.NEEDS_CHANGES, label: 'À modifier' },
  { value: ArticleStatus.PUBLISHED, label: 'Publié' },
  { value: ArticleStatus.ARCHIVED, label: 'Archivé' },
];

export const ArticlesContent = () => {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    articleId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<ArticleSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const searchParams = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState<'all' | ArticleStatus>(
    (searchParams.get('status') as ArticleStatus) || 'all'
  );

  const {
    articles,
    pagination,
    deleteArticle,
    isLoading,
    updateArticleStatus,
  } = useAdminArticles({
    page,
    limit: pageSize,
    search: searchQuery,
    sortField,
    sortOrder,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: ArticleSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Filtrer les options de statut selon les permissions
  const filteredStatusOptions = STATUS_OPTIONS.filter(option => {
    if (option.value === 'all') return true;
    if (hasSufficientRole(user?.role, 'SENIOR_EDITOR')) return true;

    if (option.value === ArticleStatus.DELETED) {
      return false;
    }

    const mockArticle = {
      status: option.value as ArticleStatus,
      userId: user?.id ?? '',
    };
    return canEditArticle(user?.role, mockArticle, user?.id);
  });

  const moveToTrash = async ({
    id,
    status,
  }: {
    id: string;
    status: ArticleStatus;
  }) => {
    return updateArticleStatus.mutateAsync({
      id,
      status: ArticleStatus.DELETED,
      comment: 'Article déplacé dans la corbeille',
      previousStatus: status,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.articleId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        await Promise.all(
          selectedIds.map(id => {
            const article = articles.find(a => a.id === id);
            if (!article) return Promise.resolve();
            return moveToTrash({ id, status: article.status });
          })
        );
        showSuccess('Articles déplacés dans la corbeille');
        setSelectedIds([]);
      } else if (deleteDialog.articleId) {
        const article = articles.find(a => a.id === deleteDialog.articleId);
        if (article) {
          await moveToTrash({
            id: deleteDialog.articleId,
            status: article.status,
          });
          showSuccess('Article déplacé dans la corbeille');
        }
      }
      setDeleteDialog({
        isOpen: false,
        articleId: null,
        isBatchDelete: false,
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const renderActions = (row: IArticleData) => {
    const actions = [];

    if (
      row.status === ArticleStatus.PENDING_APPROVAL &&
      canPublishArticles(user?.role)
    ) {
      actions.push({
        label: 'Publier',
        icon: FiCheck,
        color: 'success.main',
        disabled: updateArticleStatus.isPending,
        onClick: async () => {
          try {
            await updateArticleStatus.mutateAsync({
              id: row.id,
              status: ArticleStatus.PUBLISHED,
              previousStatus: row.status,
              comment: 'Article publié',
            });
            showSuccess('Article publié avec succès');
          } catch (error) {
            console.error('Error publishing article:', error);
            showError('Une erreur est survenue lors de la publication');
          }
        },
      });
    } else if (
      row.status === ArticleStatus.PUBLISHED &&
      canPublishArticles(user?.role)
    ) {
      actions.push({
        label: 'Dépublier',
        icon: FiEyeOff,
        color: 'warning.main',
        disabled: updateArticleStatus.isPending,
        onClick: async () => {
          try {
            await updateArticleStatus.mutateAsync({
              id: row.id,
              status: ArticleStatus.PENDING_APPROVAL,
              previousStatus: row.status,
              comment: 'Article dépublié',
            });
            showSuccess('Article mis en attente avec succès');
          } catch (error) {
            console.error('Error unpublishing article:', error);
            showError('Une erreur est survenue lors de la dépublication');
          }
        },
      });
    }

    actions.push(
      defaultActions.edit(
        `/admin/articles/${row.id}/edit`,
        !canEditArticle(
          user?.role,
          { status: row.status, userId: row.user.id },
          user?.id
        )
      ),
      defaultActions.delete(
        () =>
          setDeleteDialog({
            isOpen: true,
            articleId: row.id,
            isBatchDelete: false,
          }),
        !canDeleteArticles(
          user?.role,
          { status: row.status, userId: row.user.id },
          user?.id
        )
      )
    );

    return <AdminActionButtons actions={actions} />;
  };

  const handleBatchPublish = async (status: ArticleStatus) => {
    try {
      const articlesToUpdate = selectedIds.filter(id => {
        const article = articles.find(a => a.id === id);
        if (status === ArticleStatus.PUBLISHED) {
          return article?.status === ArticleStatus.PENDING_APPROVAL;
        } else {
          return article?.status === ArticleStatus.PUBLISHED;
        }
      });

      await Promise.all(
        articlesToUpdate.map(id => {
          const article = articles.find(a => a.id === id);
          return updateArticleStatus.mutateAsync({
            id,
            status,
            previousStatus: article?.status,
            comment:
              status === ArticleStatus.PUBLISHED
                ? 'Article publié'
                : 'Article dépublié',
          });
        })
      );

      showSuccess(
        `Articles ${
          status === ArticleStatus.PUBLISHED ? 'publiés' : 'mis en attente'
        } avec succès`
      );
      setSelectedIds([]);
    } catch (error) {
      console.error('Error updating articles status:', error);
      showError("Une erreur est survenue lors du changement d'état");
    }
  };

  const renderBatchActions = () => (
    <Stack direction='row' spacing={2}>
      <Button
        color='success'
        disabled={
          !selectedIds.some(
            id =>
              articles.find(a => a.id === id)?.status ===
              ArticleStatus.PENDING_APPROVAL
          ) || !canPublishArticles(user?.role)
        }
        size='small'
        startIcon={<FiCheck />}
        variant='outlined'
        onClick={() => handleBatchPublish(ArticleStatus.PUBLISHED)}
      >
        Publier
      </Button>
      <Button
        color='warning'
        disabled={
          !selectedIds.some(
            id =>
              articles.find(a => a.id === id)?.status ===
              ArticleStatus.PUBLISHED
          ) || !canPublishArticles(user?.role)
        }
        size='small'
        startIcon={<FiEyeOff />}
        variant='outlined'
        onClick={() => handleBatchPublish(ArticleStatus.PENDING_APPROVAL)}
      >
        Dépublier
      </Button>
      <Button
        color='error'
        disabled={
          selectedIds.length === 0 ||
          !selectedIds.some(id => {
            const article = articles.find(a => a.id === id);
            return (
              article &&
              canDeleteArticles(
                user?.role,
                { status: article.status, userId: article.user.id },
                user?.id
              )
            );
          })
        }
        size='small'
        startIcon={<FiTrash2 />}
        variant='outlined'
        onClick={() =>
          setDeleteDialog({
            articleId: null,
            isBatchDelete: true,
            isOpen: true,
          })
        }
      >
        Supprimer
      </Button>
    </Stack>
  );

  return (
    <>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Stack alignItems='center' direction='row'>
          {hasSufficientRole(user?.role, 'SENIOR_EDITOR') && (
            <Button
              component={Link}
              href='/admin/articles/trash'
              size='small'
              startIcon={<FiTrash2 />}
              sx={{ mr: 2 }}
              variant='outlined'
            >
              Corbeille
            </Button>
          )}
          <AdminActions
            createHref='/admin/articles/new'
            createLabel='Ajouter un article'
          />
        </Stack>
      </Stack>

      <Stack direction='row' justifyContent='space-between' mb={2}>
        <AdminFilters<'all' | ArticleStatus>
          showStatusFilter
          searchPlaceholder='Rechercher un article...'
          selectedStatus={selectedStatus}
          statusOptions={filteredStatusOptions}
          onSearch={setSearchQuery}
          onStatusChange={setSelectedStatus}
        />
      </Stack>

      <AdminDataTable<IArticleData, ArticleSortField>
        selectable
        batchActions={renderBatchActions}
        columns={[
          {
            field: 'title',
            headerName: 'Titre',
            sortable: true,
            width: '150px',
            render: row => (
              <Link
                className='hover:underline'
                href={`/admin/articles/${row.id}/view`}
                style={{
                  color: 'var(--mui-palette-primary-main)',
                  textDecoration: 'none',
                }}
              >
                {row.title}
              </Link>
            ),
          },
          {
            field: 'status',
            headerName: 'Statut',
            sortable: true,
            render: row => {
              const style = getStatusStyle(row.status);
              return <ColorDot color={style.color} label={style.label} />;
            },
            width: '120px',
          },
          {
            field: 'category',
            headerName: 'Catégorie',
            render: row => row.category?.name,
            sortable: true,
            width: '150px',
          },
          {
            field: 'createdAt',
            headerName: 'Créé le',
            render: row => dayjs(row.createdAt).format('LL'),
            sortable: true,
            width: '200px',
          },
          {
            field: 'updatedAt',
            headerName: 'Mis à jour le',
            render: row => dayjs(row.updatedAt).format('LL'),
            sortable: true,
            width: '200px',
          },
          {
            field: 'user',
            headerName: 'Auteur',
            render: row => row.user?.username,
            sortable: true,
            width: '150px',
          },
          {
            field: 'actions',
            headerName: 'Actions',
            render: renderActions,
            width: '120px',
          },
        ]}
        emptyMessage='Aucun article trouvé'
        getRowId={row => row.id}
        isLoading={isLoading || deleteArticle.isPending}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        pages={pagination?.pages ?? 1}
        rows={articles}
        selectedIds={selectedIds}
        sortField={sortField}
        sortOrder={sortOrder}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onSelectionChange={setSelectedIds}
        onSort={handleSort}
      />

      <AdminDeleteDialog
        isLoading={deleteArticle.isPending}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir déplacer les ${selectedIds.length} articles sélectionnés vers la corbeille ?`
            : 'Êtes-vous sûr de vouloir déplacer cet article vers la corbeille ?'
        }
        title={
          deleteDialog.isBatchDelete
            ? 'Déplacer vers la corbeille'
            : 'Déplacer vers la corbeille'
        }
        onClose={() =>
          !deleteArticle.isPending &&
          setDeleteDialog({
            isOpen: false,
            articleId: null,
            isBatchDelete: false,
          })
        }
        onConfirm={handleDelete}
      />
    </>
  );
};
