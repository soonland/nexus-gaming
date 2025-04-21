'use client';

import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminFilters,
  AdminList,
  AdminPageLayout,
  Pagination,
  defaultActions,
} from '@/components/admin';
import { SideColorBadge, useNotifier } from '@/components/common';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import dayjs from '@/lib/dayjs';
import type { IArticleData } from '@/types';

import { getStatusStyle } from './_components/articleStyles';

type ArticleSortField = keyof Pick<
  IArticleData,
  'title' | 'createdAt' | 'updatedAt' | 'status'
>;

const DEFAULT_PAGE_SIZE = 10;

interface IDeleteDialogState {
  isOpen: boolean;
  articleId: string | null;
}

const AdminArticlesPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    articleId: null,
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
  });
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: ArticleSortField) => {
    setSortField(field);
    setSortOrder(
      field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'createdAt') {
      const dateA = aValue ? dayjs(String(aValue)) : dayjs(0);
      const dateB = bValue ? dayjs(String(bValue)) : dayjs(0);
      return dateA.diff(dateB) * order;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredArticles = sortedArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEmpty = filteredArticles.length === 0;

  const handleDelete = async () => {
    if (deleteDialog.articleId) {
      try {
        await deleteArticle.mutateAsync(deleteDialog.articleId);
        showSuccess('Article supprimé avec succès');
        setDeleteDialog({ isOpen: false, articleId: null });
      } catch (error) {
        console.error('Error deleting article:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const renderActions = (row: IArticleData) => {
    const actions = [];

    if (row.status === 'PENDING_APPROVAL') {
      actions.push({
        label: 'Publier',
        icon: FiCheck,
        color: 'success.main',
        onClick: async () => {
          try {
            await updateArticleStatus.mutateAsync({
              id: row.id,
              status: 'PUBLISHED',
            });
            showSuccess('Article publié avec succès');
          } catch (error) {
            console.error('Error publishing article:', error);
            showError('Une erreur est survenue lors de la publication');
          }
        },
        disabled: updateArticleStatus.isPending,
      });
    }

    actions.push(
      defaultActions.edit(`/admin/articles/${row.id}/edit`),
      defaultActions.delete(
        () =>
          setDeleteDialog({
            isOpen: true,
            articleId: row.id,
          }),
        deleteArticle.isPending && deleteDialog.articleId === row.id
      )
    );

    return <AdminActionButtons actions={actions} />;
  };

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
      {pagination && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          total={pagination.total}
          totalPages={pagination.pages}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      <AdminList
        emptyMessage='Aucun article trouvé'
        isEmpty={isEmpty}
        isLoading={deleteArticle.isPending || isLoading}
      >
        <AdminDataTable<IArticleData, ArticleSortField>
          columns={[
            {
              field: 'title',
              headerName: 'Titre',
              sortable: true,
              width: '150px',
            },
            {
              field: 'status',
              headerName: 'Statut',
              sortable: true,
              render: row => {
                const style = getStatusStyle(row.status);
                return (
                  <SideColorBadge
                    backgroundColor={style.backgroundColor}
                    color={style.color}
                    label={style.label}
                  />
                );
              },
              width: '120px',
            },
            {
              field: 'createdAt',
              headerName: 'Créé le',
              render: row => dayjs(row.createdAt).format('LL'),
              sortable: true,
              width: '200px',
            },
            {
              field: 'actions',
              headerName: 'Actions',
              render: renderActions,
              width: '120px',
            },
          ]}
          rows={filteredArticles}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </AdminList>
      {pagination && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          total={pagination.total}
          totalPages={pagination.pages}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      <AdminDeleteDialog
        isLoading={deleteArticle.isPending}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cette annonce ?'
        title="Supprimer l'annonce"
        onClose={() =>
          !deleteArticle.isPending &&
          setDeleteDialog({ isOpen: false, articleId: null })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminArticlesPage;
