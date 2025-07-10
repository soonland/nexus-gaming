'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { FiPlus as AddIcon, FiTrash2 } from 'react-icons/fi';

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
import { ColorDot } from '@/components/common';
import { useNotifier } from '@/components/common/Notifier';
import { useCompanies } from '@/hooks/useCompanies';
import type { ICompanyData } from '@/types/api';

type CompanySortField = keyof Pick<
  ICompanyData,
  'name' | 'createdAt' | 'updatedAt'
>;

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

interface IDeleteDialogState {
  isOpen: boolean;
  companyId: string | null;
  isBatchDelete: boolean;
}

const ROLE_STYLES = {
  developer: {
    label: 'Développeur',
    color: 'rgb(0, 105, 92)',
    backgroundColor: 'rgb(232, 245, 233)',
  },
  publisher: {
    label: 'Éditeur',
    color: 'rgb(66, 33, 99)',
    backgroundColor: 'rgb(237, 231, 246)',
  },
} as const;

const AdminCompaniesPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    companyId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<CompanySortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    companies = [],
    pagination,
    isLoading,
    deleteCompany,
    isDeleting,
  } = useCompanies({
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

  const handleSort = (field: CompanySortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async () => {
    if (!deleteDialog.companyId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        await Promise.all(selectedIds.map(id => deleteCompany(id)));
        showSuccess('Sociétés supprimées avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.companyId) {
        await deleteCompany(deleteDialog.companyId);
        showSuccess('Société supprimée avec succès');
      }
      setDeleteDialog({
        isOpen: false,
        companyId: null,
        isBatchDelete: false,
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const renderRoles = (company: ICompanyData) => {
    const badges = [];

    if (company.isDeveloper) {
      const style = ROLE_STYLES.developer;
      badges.push(
        <ColorDot key='dev' color={style.color} label={style.label} />
      );
    }

    if (company.isPublisher) {
      const style = ROLE_STYLES.publisher;
      badges.push(
        <ColorDot key='pub' color={style.color} label={style.label} />
      );
    }

    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {badges}
      </div>
    );
  };

  const renderActions = (row: ICompanyData) => (
    <AdminActionButtons
      actions={[
        defaultActions.edit(`/admin/companies/${row.id}/edit`),
        defaultActions.delete(() =>
          setDeleteDialog({
            isOpen: true,
            companyId: row.id,
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
            companyId: null,
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
      label: 'Ajouter une société',
      icon: AddIcon,
      href: '/admin/companies/new',
      variant: 'contained',
    },
  ];
  return (
    <AdminPageLayout
      actions={<AdminActions actions={actions} />}
      title='Gestion des sociétés'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une société...'
        onSearch={setSearchQuery}
      />
      <AdminDataTable<ICompanyData, CompanySortField>
        selectable
        batchActions={renderBatchActions}
        columns={[
          {
            field: 'name',
            headerName: 'Nom',
            sortable: true,
          },
          {
            field: 'isDeveloper',
            headerName: 'Rôles',
            render: renderRoles,
            width: '250px',
          },
          {
            field: 'actions',
            headerName: 'Actions',
            render: renderActions,
            width: '120px',
          },
        ]}
        emptyMessage='Aucune société trouvée'
        getRowId={row => row.id}
        isLoading={isLoading || isDeleting}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        pages={pagination?.pages ?? 1}
        rows={companies}
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
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} sociétés sélectionnées ?`
            : 'Êtes-vous sûr de vouloir supprimer cette société ?'
        }
        title='Supprimer la société'
        onClose={() =>
          !isLoading &&
          setDeleteDialog({
            isOpen: false,
            companyId: null,
            isBatchDelete: false,
          })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminCompaniesPage;
