'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { FiClock, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';

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
import { ColorDot, useNotifier } from '@/components/common';
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import type { IAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import dayjs from '@/lib/dayjs';

import {
  getAnnouncementTypeStyle,
  getStatusStyle,
} from './_components/announcementStyles';

type AnnouncementSortField = keyof Pick<
  IAdminAnnouncement,
  'message' | 'createdAt' | 'expiresAt' | 'type' | 'isActive'
>;

interface IDeleteDialogState {
  isOpen: boolean;
  announcementId: string | null;
  isBatchDelete: boolean;
}

const AdminAnnouncementsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    announcementId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] =
    useState<AnnouncementSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const {
    announcements = [],
    deleteAnnouncement,
    toggleAnnouncementStatus,
    extendAnnouncement,
    isLoading,
  } = useAdminAnnouncement();
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: AnnouncementSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'createdAt' || sortField === 'expiresAt') {
      const dateA = aValue ? dayjs(String(aValue)) : dayjs(0);
      const dateB = bValue ? dayjs(String(bValue)) : dayjs(0);
      return dateA.diff(dateB) * order;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * order;
    }
    return 0;
  });

  const filteredAnnouncements = sortedAnnouncements.filter(announcement =>
    announcement.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteDialog.announcementId && !deleteDialog.isBatchDelete) return;

    try {
      if (deleteDialog.isBatchDelete) {
        // Delete all selected announcements
        await Promise.all(
          selectedIds.map(id => deleteAnnouncement.mutateAsync(id))
        );
        showSuccess('Annonces supprimées avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.announcementId) {
        // Delete single announcement
        await deleteAnnouncement.mutateAsync(deleteDialog.announcementId);
        showSuccess('Annonce supprimée avec succès');
      }
      setDeleteDialog({
        announcementId: null,
        isBatchDelete: false,
        isOpen: false,
      });
    } catch (error) {
      console.error('Error deleting announcement(s):', error);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const handleExtend = async (id: string, days: number) => {
    try {
      await extendAnnouncement.mutateAsync({ id, days });
      showSuccess(`Annonce prolongée de ${days} jour${days > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error extending announcement:', error);
      showError('Une erreur est survenue lors de la prolongation');
    }
  };

  const handleBatchExtend = async (days: number) => {
    try {
      await Promise.all(
        selectedIds.map(id => extendAnnouncement.mutateAsync({ id, days }))
      );
      showSuccess(`Annonces prolongées de ${days} jour${days > 1 ? 's' : ''}`);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error extending announcements:', error);
      showError('Une erreur est survenue lors de la prolongation');
    }
  };

  const handleToggleStatus = async (announcement: IAdminAnnouncement) => {
    try {
      await toggleAnnouncementStatus.mutateAsync({
        id: announcement.id,
        isActive: announcement.isActive === 'active' ? 'inactive' : 'active',
      });
      showSuccess(
        `Annonce ${
          announcement.isActive === 'active' ? 'désactivée' : 'activée'
        } avec succès`
      );
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      showError("Une erreur est survenue lors du changement d'état");
    }
  };

  const handleBatchToggleStatus = async (
    targetStatus: 'active' | 'inactive'
  ) => {
    try {
      await Promise.all(
        selectedIds.map(id =>
          toggleAnnouncementStatus.mutateAsync({
            id,
            isActive: targetStatus,
          })
        )
      );
      showSuccess(
        `Annonces ${targetStatus === 'active' ? 'activées' : 'désactivées'} avec succès`
      );
      setSelectedIds([]);
    } catch (error) {
      console.error('Error toggling announcements status:', error);
      showError("Une erreur est survenue lors du changement d'état");
    }
  };

  const renderActions = (row: IAdminAnnouncement) => {
    const actions = [
      defaultActions.edit(`/admin/announcements/${row.id}/edit`),
      {
        label: row.isActive === 'active' ? 'Désactiver' : 'Activer',
        icon: row.isActive === 'active' ? FiEyeOff : FiEye,
        onClick: () => handleToggleStatus(row),
        color: row.isActive === 'active' ? 'warning.main' : 'success.main',
      },
    ];

    // Add extend options if expiring soon
    if (row.expiresAt && dayjs(row.expiresAt).diff(dayjs(), 'hours') <= 24) {
      const extendOptions = [
        { days: 1, label: '+1 jour' },
        { days: 3, label: '+3 jours' },
        { days: 5, label: '+5 jours' },
        { days: 7, label: '+1 semaine' },
      ];

      extendOptions.forEach(option => {
        actions.push({
          label: option.label,
          icon: FiClock,
          onClick: () => handleExtend(row.id, option.days),
          disabled: extendAnnouncement.isPending,
          color: 'success.main',
        });
      });
    }

    actions.push(
      defaultActions.delete(
        () =>
          setDeleteDialog({
            announcementId: row.id,
            isBatchDelete: false,
            isOpen: true,
          }),
        deleteAnnouncement.isPending && deleteDialog.announcementId === row.id
      )
    );

    return <AdminActionButtons actions={actions} />;
  };

  const renderBatchActions = () => (
    <Stack direction='row' spacing={2}>
      <Button
        color='success'
        size='small'
        startIcon={<FiEye />}
        variant='outlined'
        onClick={() => handleBatchToggleStatus('active')}
      >
        Activer
      </Button>
      <Button
        color='warning'
        size='small'
        startIcon={<FiEyeOff />}
        variant='outlined'
        onClick={() => handleBatchToggleStatus('inactive')}
      >
        Désactiver
      </Button>
      <Button
        size='small'
        startIcon={<FiClock />}
        variant='outlined'
        onClick={() => handleBatchExtend(7)}
      >
        Prolonger d&apos;une semaine
      </Button>
      <Button
        color='error'
        size='small'
        startIcon={<FiTrash2 />}
        variant='outlined'
        onClick={() =>
          setDeleteDialog({
            announcementId: null,
            isBatchDelete: true,
            isOpen: true,
          })
        }
      >
        Supprimer
      </Button>
    </Stack>
  );

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/announcements/new'
          createLabel='Ajouter une annonce'
        />
      }
      title='Gestion des annonces'
    >
      <AdminFilters
        searchPlaceholder='Rechercher une annonce...'
        onSearch={setSearchQuery}
      />
      <AdminList isLoading={isLoading}>
        <AdminDataTable<IAdminAnnouncement, AnnouncementSortField>
          selectable
          batchActions={renderBatchActions}
          columns={[
            {
              field: 'type',
              headerName: 'Type',
              render: row => {
                const style = getAnnouncementTypeStyle(row.type);
                return <ColorDot color={style.color} label={style.label} />;
              },
              sortable: true,
              width: '150px',
            },
            {
              field: 'message',
              headerName: 'Message',
              sortable: true,
            },
            {
              field: 'isActive',
              headerName: 'État',
              render: row => {
                const style = getStatusStyle(row.isActive);
                return <ColorDot color={style.color} label={style.label} />;
              },
              sortable: true,
              width: '250px',
            },
            {
              field: 'expiresAt',
              headerName: "Date d'expiration",
              render: row =>
                row.expiresAt ? dayjs(row.expiresAt).format('LL') : '-',
              sortable: true,
              width: '200px',
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
          getRowId={row => row.id}
          rows={filteredAnnouncements}
          selectedIds={selectedIds}
          sortField={sortField}
          sortOrder={sortOrder}
          onSelectionChange={setSelectedIds}
          onSort={handleSort}
        />
      </AdminList>
      <AdminDeleteDialog
        isLoading={deleteAnnouncement.isPending}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} annonces sélectionnées ?`
            : 'Êtes-vous sûr de vouloir supprimer cette annonce ?'
        }
        title={
          deleteDialog.isBatchDelete
            ? 'Supprimer les annonces'
            : "Supprimer l'annonce"
        }
        onClose={() =>
          !deleteAnnouncement.isPending &&
          setDeleteDialog({
            announcementId: null,
            isBatchDelete: false,
            isOpen: false,
          })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminAnnouncementsPage;
