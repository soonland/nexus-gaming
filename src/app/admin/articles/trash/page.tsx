'use client';

import { Box, Button, Stack } from '@mui/material';
import { ArticleStatus } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import {
  FiTrash2,
  FiRotateCcw,
  FiPlus as AddIcon,
  FiArrowLeft as BackIcon,
} from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminFilters,
  AdminPageLayout,
} from '@/components/admin';
import { ColorDot, useNotifier } from '@/components/common';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';
import { canDeleteArticles, hasSufficientRole } from '@/lib/permissions';
import type { IArticleData } from '@/types';

import { getStatusStyle } from '../_components/articleStyles';

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

const AdminArticlesTrashPage = () => {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    articleId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<ArticleSortField>('updatedAt');
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
    status: ArticleStatus.DELETED,
  });

  const { showSuccess, showError } = useNotifier();

  if (!hasSufficientRole(user?.role, 'SENIOR_EDITOR')) {
    return (
      <AdminPageLayout title='Corbeille'>
        <Box>Vous n'avez pas accès à cette section.</Box>
      </AdminPageLayout>
    );
  }

  const handleSort = (field: ArticleSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleRestore = async (articleId: string) => {
    try {
      // Rechercher l'article pour obtenir son statut précédent
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      await updateArticleStatus.mutateAsync({
        id: articleId,
        status: article.previousStatus ?? ArticleStatus.DRAFT,
        comment: 'Article restauré depuis la corbeille',
      });
      showSuccess('Article restauré avec succès');
    } catch (error) {
      console.error('Error restoring article:', error);
      showError('Une erreur est survenue lors de la restauration');
    }
  };

  const handleBatchRestore = async () => {
    try {
      await Promise.all(
        selectedIds.map(id => {
          const article = articles.find(a => a.id === id);
          return updateArticleStatus.mutateAsync({
            id,
            status: article?.previousStatus ?? ArticleStatus.DRAFT,
            comment: 'Article restauré depuis la corbeille',
          });
        })
      );
      showSuccess('Articles restaurés avec succès');
      setSelectedIds([]);
    } catch (error) {
      console.error('Error restoring articles:', error);
      showError('Une erreur est survenue lors de la restauration');
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteDialog.articleId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        // Supprimer définitivement tous les articles sélectionnés
        await Promise.all(selectedIds.map(id => deleteArticle.mutateAsync(id)));
        showSuccess('Articles supprimés définitivement');
        setSelectedIds([]);
      } else if (deleteDialog.articleId) {
        // Supprimer définitivement l'article
        await deleteArticle.mutateAsync(deleteDialog.articleId);
        showSuccess('Article supprimé définitivement');
      }
      setDeleteDialog({
        isOpen: false,
        articleId: null,
        isBatchDelete: false,
      });
    } catch (error) {
      console.error('Error permanently deleting article:', error);
      showError('Une erreur est survenue lors de la suppression définitive');
    }
  };

  const renderActions = (row: IArticleData) => {
    const actions = [
      {
        label: 'Restaurer',
        icon: FiRotateCcw,
        color: 'success.main' as const,
        onClick: () => handleRestore(row.id),
      },
      {
        label: 'Supprimer définitivement',
        icon: FiTrash2,
        color: 'error.main' as const,
        onClick: () =>
          setDeleteDialog({
            isOpen: true,
            articleId: row.id,
            isBatchDelete: false,
          }),
        disabled: !canDeleteArticles(
          user?.role,
          { status: row.status, userId: row.user.id },
          user?.id
        ),
      },
    ];

    return <AdminActionButtons actions={actions} />;
  };

  const renderBatchActions = () => (
    <Stack direction='row' spacing={2}>
      <Button
        color='success'
        size='small'
        startIcon={<FiRotateCcw />}
        variant='outlined'
        onClick={handleBatchRestore}
      >
        Restaurer
      </Button>
      <Button
        color='error'
        disabled={selectedIds.length === 0}
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
        Supprimer définitivement
      </Button>
    </Stack>
  );

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          actions={[
            {
              label: 'Retour aux articles',
              icon: BackIcon,
              href: '/admin/articles',
              variant: 'contained',
            },
            {
              label: 'Créer un article',
              icon: AddIcon,
              href: '/admin/articles/new',
              variant: 'contained',
            },
          ]}
        />
      }
      title='Corbeille'
    >
      <Stack spacing={2}>
        <AdminFilters
          searchPlaceholder='Rechercher un article...'
          onSearch={setSearchQuery}
        />
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
              field: 'previousStatus',
              headerName: 'Statut précédent',
              sortable: true,
              render: row => {
                if (!row.previousStatus) return '-';
                const style = getStatusStyle(row.previousStatus);
                return <ColorDot color={style.color} label={style.label} />;
              },
              width: '150px',
            },
            {
              field: 'category',
              headerName: 'Catégorie',
              render: row => row.category?.name,
              sortable: true,
              width: '150px',
            },
            {
              field: 'deletedAt',
              headerName: 'Supprimé le',
              render: row => dayjs(row.deletedAt).format('LL'),
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
              width: '200px',
            },
          ]}
          emptyMessage='Aucun article dans la corbeille'
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
              ? `Êtes-vous sûr de vouloir supprimer définitivement les ${selectedIds.length} articles sélectionnés ? Cette action est irréversible.`
              : 'Êtes-vous sûr de vouloir supprimer définitivement cet article ? Cette action est irréversible.'
          }
          title={
            deleteDialog.isBatchDelete
              ? 'Supprimer définitivement les articles'
              : "Supprimer définitivement l'article"
          }
          onClose={() =>
            !deleteArticle.isPending &&
            setDeleteDialog({
              isOpen: false,
              articleId: null,
              isBatchDelete: false,
            })
          }
          onConfirm={handlePermanentDelete}
        />
      </Stack>
    </AdminPageLayout>
  );
};

export default AdminArticlesTrashPage;
