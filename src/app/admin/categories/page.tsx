'use client';

import {
  Box,
  Button,
  ButtonGroup,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useState } from 'react';
import { FiStar, FiFolderPlus, FiFolder, FiInfo } from 'react-icons/fi';

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
  const [showAllCategories, setShowAllCategories] = useState(true);
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

  const sortedCategories = [...categories].sort((a, b) => {
    // Forcer le tri par nom si on trie par une autre colonne
    if (sortField !== 'name') {
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
    }

    // Si l'un est une sous-catégorie de l'autre, les garder ensemble
    if (a.id === b.parentId) return -1;
    if (b.id === a.parentId) return 1;
    // Si les deux sont des sous-catégories du même parent
    if (a.parentId === b.parentId) {
      const order = sortOrder === 'asc' ? 1 : -1;
      return a.name.localeCompare(b.name) * order;
    }
    // Si les deux sont des catégories principales
    if (!a.parentId && !b.parentId) {
      const order = sortOrder === 'asc' ? 1 : -1;
      return a.name.localeCompare(b.name) * order;
    }
    // Sinon, trouver les parents respectifs pour le tri
    const parentA = !a.parentId
      ? a
      : categories.find(c => c.id === a.parentId) || a;
    const parentB = !b.parentId
      ? b
      : categories.find(c => c.id === b.parentId) || b;
    // Trier d'abord par les catégories parentes
    const order = sortOrder === 'asc' ? 1 : -1;
    return parentA.name.localeCompare(parentB.name) * order;
  });

  const filteredCategories = sortedCategories.filter(category => {
    const searchLower = searchQuery.toLowerCase();
    const matchesName = category.name.toLowerCase().includes(searchLower);
    const parent = category.parentId
      ? categories.find(cat => cat.id === category.parentId)
      : null;
    const matchesParent = parent
      ? parent.name.toLowerCase().includes(searchLower)
      : false;

    // Afficher si le nom correspond OU si le nom du parent correspond
    // ET respecter le filtre des catégories principales si actif
    return (
      (matchesName || matchesParent) &&
      (showAllCategories || !category.parentId)
    );
  });

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
          disabled: row.isDefault || !!row.parentId,
          tooltip: row.parentId
            ? 'Seules les catégories principales peuvent être définies par défaut'
            : undefined,
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
      subtitle={
        <Stack
          alignItems='center'
          direction='row'
          spacing={1}
          sx={{ color: 'text.secondary' }}
        >
          <FiInfo size={16} />
          <Typography variant='body2'>
            Seules les catégories principales peuvent être définies par défaut
          </Typography>
        </Stack>
      }
      title='Gestion des catégories'
    >
      <Stack spacing={2} sx={{ mb: 2 }}>
        <AdminFilters
          searchPlaceholder='Rechercher une catégorie...'
          onSearch={setSearchQuery}
        />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Typography color='text.secondary' variant='body2'>
            Filtrer par :
          </Typography>
          <ButtonGroup size='small'>
            <Button
              variant={showAllCategories ? 'contained' : 'outlined'}
              onClick={() => setShowAllCategories(true)}
            >
              Toutes les catégories
            </Button>
            <Button
              variant={!showAllCategories ? 'contained' : 'outlined'}
              onClick={() => setShowAllCategories(false)}
            >
              Catégories principales
            </Button>
          </ButtonGroup>
        </div>
      </Stack>
      <AdminList error={error} isLoading={isLoading}>
        <AdminDataTable<ICategoryData, CategorySortField>
          columns={[
            {
              field: 'name',
              headerName: 'Nom',
              sortable: true,
              render: row => (
                <Stack alignItems='center' direction='row' spacing={1}>
                  {/* Indentation pour les sous-catégories */}
                  {row.parentId && <Box sx={{ width: 32 }} />}

                  {/* Icône de dossier */}
                  {row.parentId ? (
                    <FiFolder
                      style={{ color: 'var(--mui-palette-text-secondary)' }}
                    />
                  ) : (
                    <FiFolderPlus
                      style={{ color: 'var(--mui-palette-text-secondary)' }}
                    />
                  )}

                  {/* Nom avec lien */}
                  <Link
                    className='hover:underline'
                    href={`/admin/categories/${row.id}/edit`}
                    style={{
                      color: 'var(--mui-palette-primary-main)',
                      textDecoration: 'none',
                    }}
                  >
                    {row.name}
                  </Link>

                  {/* Badge pour catégorie par défaut */}
                  {row.isDefault && (
                    <Typography
                      component='span'
                      sx={{
                        color: 'warning.main',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                      variant='caption'
                    >
                      <FiStar size={12} style={{ fill: yellow[800] }} />
                      (Défaut)
                    </Typography>
                  )}
                </Stack>
              ),
              width: '400px',
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
