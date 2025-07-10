'use client';

import { Alert, Button, Stack } from '@mui/material';
import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { FiPlus as AddIcon, FiCheck, FiX } from 'react-icons/fi';

import {
  AdminActionButtons,
  AdminActions,
  AdminDataTable,
  AdminDeleteDialog,
  AdminDeactivateDialog,
  AdminFilters,
  AdminPageLayout,
  defaultActions,
} from '@/components/admin';
import type { IActionButton } from '@/components/admin/common';
import type { IStatusOption } from '@/components/admin/common/AdminFilters';
import { ColorDot, useNotifier } from '@/components/common';
import { useAdminUsers, type IUserData } from '@/hooks/admin/useAdminUsers';
import { useAuth } from '@/hooks/useAuth';
import { hasSufficientRole } from '@/lib/permissions';

type UserSortField = 'username' | 'email' | 'role' | 'createdAt' | 'updatedAt';
type UserStatusValue = 'all' | 'active' | 'inactive';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

type IStatusOptions = 'all' | 'active' | 'inactive';
const STATUS_OPTIONS: IStatusOption<IStatusOptions>[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
];

const ROLE_STYLES: Record<Role, { color: string; label: string }> = {
  [Role.ADMIN]: { color: '#FF0000', label: 'Administrateur' },
  [Role.SENIOR_EDITOR]: { color: '#FFA500', label: 'Éditeur Senior' },
  [Role.EDITOR]: { color: '#0000FF', label: 'Éditeur' },
  [Role.MODERATOR]: { color: '#800080', label: 'Modérateur' },
  [Role.USER]: { color: '#808080', label: 'Utilisateur' },
  [Role.SYSADMIN]: { color: '#000000', label: 'Administrateur Système' },
};

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    isBatchDelete: boolean;
  }>({
    isOpen: false,
    userId: null,
    isBatchDelete: false,
  });
  const [deactivateDialog, setDeactivateDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    isBatchDeactivate: boolean;
  }>({
    isOpen: false,
    userId: null,
    isBatchDeactivate: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<UserSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const {
    users,
    pagination,
    isLoading,
    deleteUser,
    toggleUserStatus,
    cancelDeactivation,
  } = useAdminUsers({
    page,
    limit: pageSize,
    search: searchQuery,
    sortField,
    sortOrder,
    status: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  });

  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: UserSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleStatusChange = (status: UserStatusValue) => {
    setSelectedStatus(status);
  };

  const handleDelete = async () => {
    if (!deleteDialog.userId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        await Promise.all(selectedIds.map(id => deleteUser.mutateAsync(id)));
        showSuccess('Utilisateurs supprimés avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.userId) {
        await deleteUser.mutateAsync(deleteDialog.userId);
        showSuccess('Utilisateur supprimé avec succès');
      }
      setDeleteDialog({
        isOpen: false,
        userId: null,
        isBatchDelete: false,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const handleDeactivation = async () => {
    if (!deactivateDialog.userId && !deactivateDialog.isBatchDeactivate) return;

    try {
      if (deactivateDialog.isBatchDeactivate) {
        await Promise.all(
          selectedIds.map(id =>
            toggleUserStatus.mutateAsync({ id, isActive: false })
          )
        );
        showSuccess('Utilisateurs désactivés avec succès');
        setSelectedIds([]);
      } else if (deactivateDialog.userId) {
        const response = await toggleUserStatus.mutateAsync({
          id: deactivateDialog.userId,
          isActive: false,
        });
        if (response.deactivationEffectiveDate) {
          showSuccess(
            `Compte sera désactivé le ${dayjs(
              response.deactivationEffectiveDate
            ).format('LL')}`
          );
        } else {
          showSuccess('Compte désactivé avec succès');
        }
      }
      setDeactivateDialog({
        isOpen: false,
        userId: null,
        isBatchDeactivate: false,
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      showError('Une erreur est survenue lors de la désactivation');
    }
  };

  const handleDeactivationCancel = async (id: string) => {
    try {
      await cancelDeactivation.mutateAsync(id);
      showSuccess('Désactivation annulée avec succès');
    } catch (error) {
      console.error('Error canceling deactivation:', error);
      showError(
        "Une erreur est survenue lors de l'annulation de la désactivation"
      );
    }
  };

  const renderActions = (row: IUserData) => {
    const actions = [];

    if (hasSufficientRole(user?.role, row.role, '>')) {
      // Si le compte est en cours de désactivation, montrer le bouton d'annulation
      if (row.deactivationRequestedAt && row.isActive) {
        actions.push({
          label: 'Annuler la désactivation',
          icon: FiX,
          color: 'warning.main',
          onClick: () => handleDeactivationCancel(row.id),
        });
      } else if (row.isActive) {
        actions.push({
          label: 'Désactiver',
          icon: FiX,
          color: 'error.main',
          onClick: () =>
            setDeactivateDialog({
              isOpen: true,
              userId: row.id,
              isBatchDeactivate: false,
            }),
          disabled: user?.role === 'SYSADMIN' && user?.id === row.id, // Désactiver si SYSADMIN tente de se désactiver
        });
      } else {
        actions.push({
          label: 'Activer',
          icon: FiCheck,
          color: 'success.main',
          onClick: async () => {
            try {
              await toggleUserStatus.mutateAsync({
                id: row.id,
                isActive: true,
              });
              showSuccess('Compte activé avec succès');
            } catch (error) {
              console.error('Error activating user:', error);
              showError("Une erreur est survenue lors de l'activation");
            }
          },
        });
      }

      actions.push(
        defaultActions.edit(
          `/admin/users/${row.id}/edit`,
          !hasSufficientRole(user?.role, row.role, '>')
        ),
        defaultActions.delete(
          () =>
            setDeleteDialog({
              isOpen: true,
              userId: row.id,
              isBatchDelete: false,
            }),
          !hasSufficientRole(user?.role, row.role, '>') ||
            (user?.role === 'SYSADMIN' && user?.id === row.id) // Désactiver si SYSADMIN tente de se supprimer
        )
      );
    }

    return <AdminActionButtons actions={actions} />;
  };

  const renderStatus = (row: IUserData) => {
    if (row.deactivationRequestedAt && row.isActive) {
      const deactivationDate = dayjs(row.deactivationRequestedAt).add(
        7,
        'days'
      );
      return (
        <Stack>
          <ColorDot color='#FFA500' label='Désactivation en attente' />
          <Alert severity='warning' sx={{ mt: 1, py: 0 }}>
            Sera désactivé le {deactivationDate.format('LL')}
          </Alert>
        </Stack>
      );
    }

    return (
      <ColorDot
        color={row.isActive ? '#4CAF50' : '#F44336'}
        label={row.isActive ? 'Actif' : 'Inactif'}
      />
    );
  };

  const renderBatchActions = () => {
    // Ne montrer les actions par lot que pour les utilisateurs de niveau inférieur
    const eligibleIds = selectedIds.filter(id => {
      const targetUser = users.find(u => u.id === id);
      return (
        targetUser &&
        user?.role &&
        hasSufficientRole(user.role, targetUser.role, '>')
      );
    });

    if (eligibleIds.length === 0) {
      return null;
    }

    return (
      <Stack direction='row' spacing={2}>
        <Button
          color='success'
          disabled={
            !eligibleIds.some(id => {
              const targetUser = users.find(u => u.id === id);
              return targetUser && !targetUser.isActive;
            })
          }
          size='small'
          startIcon={<FiCheck />}
          variant='outlined'
          onClick={() =>
            Promise.all(
              eligibleIds.map(id =>
                toggleUserStatus.mutateAsync({ id, isActive: true })
              )
            )
          }
        >
          Activer
        </Button>
        <Button
          color='error'
          disabled={
            !eligibleIds.some(id => {
              const targetUser = users.find(u => u.id === id);
              return targetUser?.isActive;
            })
          }
          size='small'
          startIcon={<FiX />}
          variant='outlined'
          onClick={() =>
            setDeactivateDialog({
              isOpen: true,
              userId: null,
              isBatchDeactivate: true,
            })
          }
        >
          Désactiver
        </Button>
        <Button
          color='error'
          disabled={eligibleIds.length === 0}
          size='small'
          variant='outlined'
          onClick={() =>
            setDeleteDialog({
              isOpen: true,
              userId: null,
              isBatchDelete: true,
            })
          }
        >
          Supprimer
        </Button>
      </Stack>
    );
  };

  const actions: IActionButton[] = [
    {
      label: 'Ajouter un utilisateur',
      icon: AddIcon,
      href: '/admin/users/new',
      variant: 'contained',
    },
  ];
  return (
    <AdminPageLayout
      actions={<AdminActions actions={actions} />}
      title='Gestion des utilisateurs'
    >
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <AdminFilters<'all' | 'active' | 'inactive'>
          showStatusFilter
          searchPlaceholder='Rechercher un utilisateur...'
          selectedStatus={selectedStatus}
          statusOptions={STATUS_OPTIONS}
          onSearch={setSearchQuery}
          onStatusChange={handleStatusChange}
        />
      </Stack>
      <AdminDataTable<IUserData, UserSortField>
        selectable
        batchActions={renderBatchActions}
        columns={[
          {
            field: 'username',
            headerName: "Nom d'utilisateur",
            sortable: true,
            width: '150px',
            render: row => (
              <Link
                className='hover:underline'
                href={`/users/${row.username}`}
                style={{
                  color: 'var(--mui-palette-primary-main)',
                  textDecoration: 'none',
                }}
              >
                {row.username}
              </Link>
            ),
          },
          {
            field: 'email',
            headerName: 'Email',
            sortable: true,
            width: '200px',
          },
          {
            field: 'role',
            headerName: 'Rôle',
            sortable: true,
            width: '150px',
            render: row => {
              const style = ROLE_STYLES[row.role];
              return <ColorDot color={style.color} label={style.label} />;
            },
          },
          {
            field: 'isActive',
            headerName: 'Statut',
            width: '200px',
            render: renderStatus,
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
        emptyMessage='Aucun utilisateur trouvé'
        getRowId={row => row.id}
        isLoading={isLoading || deleteUser.isPending}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        pages={pagination?.pages ?? 1}
        rows={users}
        selectedIds={selectedIds}
        sortField={sortField}
        sortOrder={sortOrder}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onSelectionChange={setSelectedIds}
        onSort={handleSort}
      />
      <AdminDeleteDialog
        isLoading={deleteUser.isPending}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} utilisateurs sélectionnés ?`
            : 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
        }
        title='Supprimer des utilisateurs'
        onClose={() =>
          setDeleteDialog({
            isOpen: false,
            userId: null,
            isBatchDelete: false,
          })
        }
        onConfirm={handleDelete}
      />
      <AdminDeactivateDialog
        isLoading={toggleUserStatus.isPending}
        isOpen={deactivateDialog.isOpen}
        message={
          deactivateDialog.isBatchDeactivate
            ? `Êtes-vous sûr de vouloir désactiver les ${selectedIds.length} utilisateurs sélectionnés ? Cette action sera immédiate.`
            : 'Êtes-vous sûr de vouloir désactiver cet utilisateur ? Cette action sera immédiate.'
        }
        title='Désactiver des utilisateurs'
        onClose={() =>
          setDeactivateDialog({
            isOpen: false,
            userId: null,
            isBatchDeactivate: false,
          })
        }
        onConfirm={handleDeactivation}
      />
    </AdminPageLayout>
  );
};

export default AdminUsersPage;
