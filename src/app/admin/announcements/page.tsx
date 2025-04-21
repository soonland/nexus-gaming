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
  defaultActions,
} from '@/components/admin';
import { SideColorBadge, useNotifier } from '@/components/common';
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
}

const AdminAnnouncementsPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    announcementId: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] =
    useState<AnnouncementSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const {
    announcements = [],
    deleteAnnouncement,
    toggleAnnouncementStatus,
  } = useAdminAnnouncement();
  const { showSuccess, showError } = useNotifier();

  const handleSort = (field: AnnouncementSortField) => {
    setSortField(field);
    setSortOrder(
      field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
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

  const isEmpty = filteredAnnouncements.length === 0;

  const handleDelete = async () => {
    if (deleteDialog.announcementId) {
      try {
        await deleteAnnouncement.mutateAsync(deleteDialog.announcementId);
        showSuccess('Annonce supprimée avec succès');
        setDeleteDialog({ isOpen: false, announcementId: null });
      } catch (error) {
        console.error('Error deleting announcement:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
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

  const renderActions = (row: IAdminAnnouncement) => (
    <AdminActionButtons
      actions={[
        defaultActions.edit(`/admin/announcements/${row.id}/edit`),
        {
          label: row.isActive === 'active' ? 'Désactiver' : 'Activer',
          icon: row.isActive === 'active' ? FiEyeOff : FiEye,
          onClick: () => handleToggleStatus(row),
          color: row.isActive === 'active' ? 'warning.main' : 'success.main',
        },
        defaultActions.delete(
          () =>
            setDeleteDialog({
              isOpen: true,
              announcementId: row.id,
            }),
          deleteAnnouncement.isPending && deleteDialog.announcementId === row.id
        ),
      ]}
    />
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
      <AdminList
        emptyMessage='Aucune annonce trouvée'
        isEmpty={isEmpty}
        isLoading={
          deleteAnnouncement.isPending || toggleAnnouncementStatus.isPending
        }
      >
        <AdminDataTable<IAdminAnnouncement, AnnouncementSortField>
          columns={[
            {
              field: 'type',
              headerName: 'Type',
              sortable: true,
              render: row => {
                const style = getAnnouncementTypeStyle(row.type);
                return (
                  <SideColorBadge
                    backgroundColor={style.backgroundColor}
                    borderWidth={style.borderWidth}
                    color={style.color}
                    label={style.label}
                  />
                );
              },
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
              sortable: true,
              render: row => {
                const style = getStatusStyle(row.isActive);
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
          rows={filteredAnnouncements}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </AdminList>
      <AdminDeleteDialog
        isLoading={deleteAnnouncement.isPending}
        isOpen={deleteDialog.isOpen}
        message='Êtes-vous sûr de vouloir supprimer cette annonce ?'
        title="Supprimer l'annonce"
        onClose={() =>
          !deleteAnnouncement.isPending &&
          setDeleteDialog({ isOpen: false, announcementId: null })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminAnnouncementsPage;
