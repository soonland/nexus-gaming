'use client';

import { Button, Stack } from '@mui/material';
import { ArticleStatus } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import { FiCheck, FiEyeOff, FiTrash2 } from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminFilters,
  AdminList,
  AdminPageLayout,
  defaultActions,
} from '@/components/admin';
import { ColorDot, useNotifier } from '@/components/common';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';
import {
  canDeleteArticles,
  canPublishArticles,
  canEditArticle,
} from '@/lib/permissions';
import type { IArticleData } from '@/types';

import { getStatusStyle } from './_components/articleStyles';

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

const AdminArticlesPage = () => {
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
  });
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: ArticleSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const isEmpty = articles.length === 0;

  const handleDelete = async () => {
    if (!deleteDialog.articleId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        // Marquer tous les articles sélectionnés comme supprimés
        await Promise.all(
          selectedIds.map(id =>
            updateArticleStatus.mutateAsync({
              id,
              status: ArticleStatus.DELETED,
              comment: 'Article supprimé',
            })
          )
        );
        showSuccess('Articles supprimés avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.articleId) {
        // Marquer l'article comme supprimé
        await updateArticleStatus.mutateAsync({
          id: deleteDialog.articleId,
          status: ArticleStatus.DELETED,
          comment: 'Article supprimé',
        });
        showSuccess('Article supprimé avec succès');
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
      // Filtrer les articles pour ne traiter que ceux qui peuvent changer d'état
      const articlesToUpdate = selectedIds.filter(id => {
        const article = articles.find(a => a.id === id);
        if (status === ArticleStatus.PUBLISHED) {
          return article?.status === ArticleStatus.PENDING_APPROVAL;
        } else {
          return article?.status === ArticleStatus.PUBLISHED;
        }
      });

      await Promise.all(
        articlesToUpdate.map(id =>
          updateArticleStatus.mutateAsync({
            id,
            status,
          })
        )
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
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/articles/new'
          createLabel='Ajouter un article'
        />
      }
      title='Gestion des articles'
    >
      <AdminFilters
        searchPlaceholder='Rechercher un article...'
        onSearch={setSearchQuery}
      />
      <AdminList
        emptyMessage='Aucun article trouvé'
        isEmpty={isEmpty}
        isLoading={deleteArticle.isPending || isLoading}
      >
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
          getRowId={row => row.id}
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
      </AdminList>
      <AdminDeleteDialog
        isLoading={deleteArticle.isPending}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} articles sélectionnés ?`
            : 'Êtes-vous sûr de vouloir supprimer cet article ?'
        }
        title={
          deleteDialog.isBatchDelete
            ? 'Supprimer les articles'
            : "Supprimer l'article"
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
    </AdminPageLayout>
  );
};

export default AdminArticlesPage;
