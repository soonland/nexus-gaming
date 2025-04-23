'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
import { ColorDot } from '@/components/common';
import { useNotifier } from '@/components/common/Notifier';
import { useAuth } from '@/hooks/useAuth';
import { useUsers, useDeleteUser, useToggleUserStatus } from '@/hooks/useUsers';
import type { IUserData } from '@/hooks/useUsers';

import {
  getRoleStyle,
  getStatusStyle,
  isRoleManageable,
} from './_components/userStyles';

type UserSortField = keyof Pick<
  IUserData,
  'username' | 'email' | 'role' | 'createdAt'
>;

interface IDeleteDialogState {
  isOpen: boolean;
  userId: string | null;
}

const DEFAULT_PAGE_SIZE = 10;

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    userId: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<UserSortField>('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data: response, isLoading } = useUsers({
    page,
    limit: pageSize,
    search: searchQuery,
  });
  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: UserSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async () => {
    if (deleteDialog.userId) {
      try {
        await deleteUser.mutateAsync(deleteDialog.userId);
        showSuccess('Utilisateur supprimé avec succès');
        setDeleteDialog({ isOpen: false, userId: null });
      } catch (error) {
        console.error('Error deleting user:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (user: IUserData) => {
    try {
      await toggleStatus.mutateAsync({
        id: user.id,
        isActive: !user.isActive,
      });
      showSuccess(
        `Utilisateur ${user.isActive ? 'désactivé' : 'activé'} avec succès`
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
      showError("Une erreur est survenue lors du changement d'état");
    }
  };

  const canManageUser = (user: IUserData) => {
    if (!currentUser) return false;
    return isRoleManageable(currentUser.role, user.role);
  };

  const sortedUsers = [...(response?.users || [])].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/users/new'
          createLabel='Ajouter un utilisateur'
        />
      }
      title='Gestion des utilisateurs'
    >
      <AdminFilters
        searchPlaceholder='Rechercher un utilisateur...'
        onSearch={setSearchQuery}
      />
      {response?.pagination && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          total={response.pagination.total}
          totalPages={response.pagination.pages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
      <AdminList
        emptyMessage='Aucun utilisateur trouvé'
        isEmpty={!response?.users.length}
        isLoading={isLoading || deleteUser.isPending || toggleStatus.isPending}
      >
        <AdminDataTable<IUserData, UserSortField>
          columns={[
            {
              field: 'username',
              headerName: "Nom d'utilisateur",
              sortable: true,
            },
            {
              field: 'email',
              headerName: 'Email',
              sortable: true,
            },
            {
              field: 'role',
              headerName: 'Rôle',
              render: row => {
                const style = getRoleStyle(row.role);
                return <ColorDot color={style.color} label={style.label} />;
              },
              sortable: true,
              width: '150px',
            },
            {
              field: 'isActive',
              headerName: 'État',
              render: row => {
                const style = getStatusStyle(row.isActive);
                return <ColorDot color={style.color} label={style.label} />;
              },
              width: '120px',
            },
            {
              field: 'actions',
              headerName: 'Actions',
              render: row => {
                if (!canManageUser(row)) return null;
                return (
                  <AdminActionButtons
                    actions={[
                      defaultActions.edit(`/admin/users/${row.id}/edit`),
                      {
                        label: row.isActive ? 'Désactiver' : 'Activer',
                        icon: row.isActive ? FiEyeOff : FiEye,
                        onClick: () => handleToggleStatus(row),
                        color: row.isActive ? 'warning.main' : 'success.main',
                      },
                      defaultActions.delete(
                        () =>
                          setDeleteDialog({
                            isOpen: true,
                            userId: row.id,
                          }),
                        deleteUser.isPending && deleteDialog.userId === row.id
                      ),
                    ]}
                  />
                );
              },
              width: '120px',
            },
          ]}
          page={page}
          pages={response?.pagination.pages || 1}
          rows={filteredUsers || []}
          sortField={sortField}
          sortOrder={sortOrder}
          onPageChange={setPage}
          onSort={handleSort}
        />
      </AdminList>
      {response?.pagination && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          total={response.pagination.total}
          totalPages={response.pagination.pages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
      <AdminDeleteDialog
        isLoading={deleteUser.isPending}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
        title="Supprimer l'utilisateur"
        onClose={() =>
          !deleteUser.isPending &&
          setDeleteDialog({ isOpen: false, userId: null })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminUsersPage;
