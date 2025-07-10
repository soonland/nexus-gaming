'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { FiTrash2, FiPlus as AddIcon } from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminFilters,
  AdminPageLayout,
  defaultActions,
} from '@/components/admin';
import type { IActionButton } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { PlatformChip } from '@/components/common/PlatformChip';
import { usePlatforms } from '@/hooks/usePlatforms';
import dayjs from '@/lib/dayjs';
import type { IPlatformData } from '@/types';

type PlatformSortField = keyof Pick<
  IPlatformData,
  'name' | 'manufacturer' | 'releaseDate' | 'createdAt' | 'updatedAt' | 'color'
>;

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

interface IDeleteDialogState {
  isOpen: boolean;
  platformId: string | null;
  isBatchDelete: boolean;
}

const AdminPlatformsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    platformId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<PlatformSortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    platforms = [],
    pagination,
    isLoading,
    deletePlatform,
    isDeleting,
  } = usePlatforms({
    page,
    limit: pageSize,
    search: searchQuery,
    sortField,
    sortOrder,
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

  const handleDelete = async () => {
    if (!deleteDialog.platformId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        await Promise.all(selectedIds.map(id => deletePlatform(id)));
        showSuccess('Plateformes supprimées avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.platformId) {
        await deletePlatform(deleteDialog.platformId);
        showSuccess('Plateforme supprimée avec succès');
      }
      setDeleteDialog({
        isOpen: false,
        platformId: null,
        isBatchDelete: false,
      });
    } catch (error) {
      console.error('Error deleting platform:', error);
      showError('Une erreur est survenue lors de la suppression');
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
            isBatchDelete: false,
          })
        ),
      ]}
    />
  );

  const renderBatchActions = () => (
    <Stack direction='row' spacing={2}>
      <Button
        color='error'
        disabled={selectedIds.length === 0}
        size='small'
        startIcon={<FiTrash2 />}
        variant='outlined'
        onClick={() =>
          setDeleteDialog({
            isOpen: true,
            platformId: null,
            isBatchDelete: true,
          })
        }
      >
        Supprimer
      </Button>
    </Stack>
  );

  const actions: IActionButton[] = [
    {
      label: 'Ajouter une plateforme',
      icon: AddIcon,
      href: '/admin/platforms/new',
      variant: 'contained',
    },
  ];
  return (
    <AdminPageLayout
      actions={<AdminActions actions={actions} />}
      title='Gestion des plateformes'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une plateforme...'
        onSearch={setSearchQuery}
      />
      <AdminDataTable<IPlatformData, PlatformSortField>
        selectable
        batchActions={renderBatchActions}
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
            field: 'actions',
            headerName: 'Actions',
            render: renderActions,
            width: '120px',
          },
        ]}
        emptyMessage='Aucune plateforme trouvée'
        getRowId={row => row.id}
        isLoading={isLoading || isDeleting}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        pages={pagination?.pages ?? 1}
        rows={platforms}
        selectedIds={selectedIds}
        sortField={sortField}
        sortOrder={sortOrder}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onSelectionChange={setSelectedIds}
        onSort={handleSort}
      />
      <AdminDeleteDialog
        isLoading={isLoading || isDeleting}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} plateformes sélectionnées ?`
            : 'Êtes-vous sûr de vouloir supprimer cette plateforme ?'
        }
        title='Supprimer la plateforme'
        onClose={() =>
          !isLoading &&
          setDeleteDialog({
            isOpen: false,
            platformId: null,
            isBatchDelete: false,
          })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminPlatformsPage;
