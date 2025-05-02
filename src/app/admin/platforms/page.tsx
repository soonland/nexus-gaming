'use client';

import { useState } from 'react';

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
import { useNotifier } from '@/components/common/Notifier';
import { PlatformChip } from '@/components/common/PlatformChip';
import { usePlatforms } from '@/hooks/usePlatforms';
import dayjs from '@/lib/dayjs';
import type { IPlatformData } from '@/types';

type PlatformSortField = keyof Pick<
  IPlatformData,
  'name' | 'manufacturer' | 'releaseDate' | 'createdAt' | 'updatedAt' | 'color'
>;

interface IDeleteDialogState {
  isOpen: boolean;
  platformId: string | null;
}

const AdminPlatformsPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    platformId: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<PlatformSortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const DEFAULT_PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    platforms = [],
    pagination,
    isLoading,
    error,
    deletePlatform,
  } = usePlatforms({
    page,
    limit: pageSize,
  });

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: PlatformSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedPlatforms = [...platforms].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (
      sortField === 'releaseDate' ||
      sortField === 'createdAt' ||
      sortField === 'updatedAt'
    ) {
      const dateA = aValue ? dayjs(String(aValue)) : dayjs(0);
      const dateB = bValue ? dayjs(String(bValue)) : dayjs(0);
      return dateA.diff(dateB) * order;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredPlatforms = sortedPlatforms.filter(
    platform =>
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteDialog.platformId) {
      try {
        await deletePlatform(deleteDialog.platformId);
        showSuccess('Plateforme supprimée avec succès');
        setDeleteDialog({ isOpen: false, platformId: null });
      } catch (error) {
        console.error('Error deleting platform:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const renderActions = (row: IPlatformData) => (
    <AdminActionButtons
      actions={[
        defaultActions.edit(`/admin/platforms/${row.id}/edit`),
        defaultActions.delete(() =>
          setDeleteDialog({
            isOpen: true,
            platformId: row.id,
          })
        ),
      ]}
    />
  );

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/platforms/new'
          createLabel='Ajouter une plateforme'
        />
      }
      title='Gestion des plateformes'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une plateforme...'
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
      <AdminList error={error} isLoading={isLoading}>
        <AdminDataTable<IPlatformData, PlatformSortField>
          columns={[
            {
              field: 'name',
              headerName: 'Nom',
              render: row => <PlatformChip platform={row} variant='filled' />,
              sortable: true,
            },
            {
              field: 'manufacturer',
              headerName: 'Fabricant',
              sortable: true,
            },
            {
              field: 'releaseDate',
              headerName: 'Date de sortie',
              render: row =>
                row.releaseDate ? dayjs(row.releaseDate).format('LL') : '-',
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
          rows={filteredPlatforms}
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
        isLoading={isLoading}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cette plateforme ?'
        title='Supprimer la plateforme'
        onClose={() =>
          !isLoading && setDeleteDialog({ isOpen: false, platformId: null })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminPlatformsPage;
