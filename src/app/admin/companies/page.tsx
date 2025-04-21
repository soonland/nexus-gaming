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
import { SideColorBadge } from '@/components/common';
import { useNotifier } from '@/components/common/Notifier';
import { useCompanies } from '@/hooks/useCompanies';
import type { ICompanyData } from '@/types/api';

type CompanySortField = keyof Pick<ICompanyData, 'name'>;

interface IDeleteDialogState {
  isOpen: boolean;
  companyId: string | null;
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
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    companyId: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<CompanySortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const DEFAULT_PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    companies = [],
    pagination,
    deleteCompany,
  } = useCompanies({
    page,
    limit: pageSize,
  });

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: CompanySortField) => {
    setSortField(field);
    setSortOrder(
      field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
  };

  const sortedCompanies = [...(companies || [])].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredCompanies = sortedCompanies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEmpty = !filteredCompanies.length;

  const handleDelete = async () => {
    if (deleteDialog.companyId) {
      try {
        await deleteCompany(deleteDialog.companyId);
        showSuccess('Société supprimée avec succès');
        setDeleteDialog({ isOpen: false, companyId: null });
      } catch (error) {
        console.error('Error deleting company:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const renderRoles = (company: ICompanyData) => {
    const badges = [];

    if (company.isDeveloper) {
      const style = ROLE_STYLES.developer;
      badges.push(
        <SideColorBadge
          key='dev'
          backgroundColor={style.backgroundColor}
          color={style.color}
          label={style.label}
        />
      );
    }

    if (company.isPublisher) {
      const style = ROLE_STYLES.publisher;
      badges.push(
        <SideColorBadge
          key='pub'
          backgroundColor={style.backgroundColor}
          color={style.color}
          label={style.label}
        />
      );
    }

    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {badges}
      </div>
    );
  };

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/companies/new'
          createLabel='Ajouter une société'
        />
      }
      title='Gestion des sociétés'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une société...'
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
      <AdminList emptyMessage='Aucune société trouvée' isEmpty={isEmpty}>
        <AdminDataTable<ICompanyData, CompanySortField>
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
              render: row => (
                <AdminActionButtons
                  actions={[
                    defaultActions.edit(`/admin/companies/${row.id}/edit`),
                    defaultActions.delete(() =>
                      setDeleteDialog({
                        isOpen: true,
                        companyId: row.id,
                      })
                    ),
                  ]}
                />
              ),
              width: '120px',
            },
          ]}
          rows={filteredCompanies}
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
        isLoading={false}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cette société ?'
        title='Supprimer la société'
        onClose={() => setDeleteDialog({ isOpen: false, companyId: null })}
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminCompaniesPage;
