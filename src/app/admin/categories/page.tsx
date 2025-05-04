'use client';

import { yellow } from '@mui/material/colors';
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

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
import { useNotifier } from '@/components/common/Notifier';
import { useCategories } from '@/hooks/useCategories';
import dayjs from '@/lib/dayjs';
import type { ICategoryData } from '@/types/api';

type CategorySortField = keyof Pick<
  ICategoryData,
  'name' | 'createdAt' | 'updatedAt'
>;

interface IDeleteDialogState {
  isOpen: boolean;
  categoryId: string | null;
}

const AdminCategoriesPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    categoryId: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<CategorySortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const {
    categories = [],
    isLoading,
    error,
    deleteCategory,
    setDefaultCategory,
  } = useCategories();
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: CategorySortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedCategories = [...(categories || [])].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      const dateA = aValue ? dayjs(String(aValue)) : dayjs(0);
      const dateB = bValue ? dayjs(String(bValue)) : dayjs(0);
      return dateA.diff(dateB) * order;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredCategories = sortedCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteDialog.categoryId) {
      try {
        await deleteCategory(deleteDialog.categoryId);
        showSuccess('Catégorie supprimée avec succès');
        setDeleteDialog({ isOpen: false, categoryId: null });
      } catch (error) {
        console.error('Error deleting category:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultCategory(id);
      showSuccess('Catégorie définie par défaut avec succès');
    } catch (error) {
      console.error('Error setting default category:', error);
      showError('Erreur lors de la définition de la catégorie par défaut');
    }
  };

  const renderActions = (row: ICategoryData) => (
    <AdminActionButtons
      actions={[
        {
          label: row.isDefault
            ? 'Catégorie par défaut'
            : 'Définir comme catégorie par défaut',
          icon: FiStar,
          color: row.isDefault ? 'warning.main' : 'action.active',
          onClick: () => handleSetDefault(row.id),
          disabled: row.isDefault,
        },
        defaultActions.edit(`/admin/categories/${row.id}/edit`),
        defaultActions.delete(() =>
          setDeleteDialog({
            isOpen: true,
            categoryId: row.id,
          })
        ),
      ]}
    />
  );

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/categories/new'
          createLabel='Ajouter une catégorie'
        />
      }
      title='Gestion des catégories'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une catégorie...'
        onSearch={setSearchQuery}
      />
      <AdminList error={error} isLoading={isLoading}>
        <AdminDataTable<ICategoryData, CategorySortField>
          columns={[
            {
              field: 'name',
              headerName: 'Nom',
              sortable: true,
            },
            {
              field: 'color',
              headerName: 'Couleur',
              render: row => (
                <div
                  style={{
                    backgroundColor: row.color || 'transparent',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                  }}
                />
              ),
              sortable: false,
            },
            {
              field: 'isDefault',
              headerName: 'Par défaut',
              width: '100px',
              itemsAlign: 'center',
              render: row =>
                row.isDefault ? (
                  <FiStar style={{ color: yellow[800], fill: yellow[800] }} />
                ) : (
                  ''
                ),
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
              headerName: 'Modifié le',
              render: row => dayjs(row.updatedAt).format('LL'),
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
          rows={filteredCategories}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </AdminList>
      <AdminDeleteDialog
        isLoading={isLoading}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cette catégorie ?'
        title='Supprimer la catégorie'
        onClose={() =>
          !isLoading && setDeleteDialog({ isOpen: false, categoryId: null })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminCategoriesPage;
