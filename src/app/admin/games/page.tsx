'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { FiPlus as AddIcon, FiTrash2 } from 'react-icons/fi';

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
import type { IActionButton } from '@/components/admin/common';
import { ColorDot } from '@/components/common';
import { useNotifier } from '@/components/common/Notifier';
import { useGames, useDeleteGame } from '@/hooks/useGames';
import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types/api';

type GameSortField = keyof Pick<IGameData, 'title' | 'createdAt' | 'updatedAt'>;

interface IDeleteDialogState {
  isOpen: boolean;
  gameId: string | null;
  isBatchDelete: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

const AdminGamesPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    gameId: null,
    isBatchDelete: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<GameSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { games, pagination, isLoading, error } = useGames({
    page,
    limit: pageSize,
    search: searchQuery,
  });

  const { showSuccess, showError } = useNotifier();

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSort = (field: GameSortField) => {
    setSortField(field);
    setSortOrder(field === sortField && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedGames = (games || []).sort((a: IGameData, b: IGameData) => {
    const order = sortOrder === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'createdAt':
        return dayjs(a.createdAt).diff(dayjs(b.createdAt)) * order;
      case 'updatedAt':
        return dayjs(a.updatedAt).diff(dayjs(b.updatedAt)) * order;
      case 'title':
        return a.title.localeCompare(b.title) * order;
      default:
        return 0;
    }
  });

  const filteredGames = sortedGames.filter((game: IGameData) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteGame = useDeleteGame();

  const handleDelete = async () => {
    try {
      if (deleteDialog.isBatchDelete) {
        await Promise.all(selectedIds.map(id => deleteGame.mutateAsync(id)));
        showSuccess('Jeux supprimés avec succès');
        setSelectedIds([]);
      } else if (deleteDialog.gameId) {
        await deleteGame.mutateAsync(deleteDialog.gameId);
        showSuccess('Jeu supprimé avec succès');
      }
      setDeleteDialog({ isOpen: false, gameId: null, isBatchDelete: false });
    } catch (error) {
      console.error('Error deleting game:', error);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

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
            gameId: null,
            isBatchDelete: true,
          })
        }
      >
        Supprimer
      </Button>
    </Stack>
  );

  const renderPlatforms = (game: IGameData) => {
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {game.platforms.map(platform => (
          <ColorDot
            key={platform.id}
            color='rgb(30, 70, 32)'
            label={platform.name}
          />
        ))}
      </div>
    );
  };

  const actions: IActionButton[] = [
    {
      label: 'Ajouter un jeu',
      icon: AddIcon,
      href: '/admin/games/new',
      variant: 'contained',
    },
  ];
  return (
    <AdminPageLayout
      actions={<AdminActions actions={actions} />}
      title='Gestion des jeux'
    >
      <AdminFilters
        searchPlaceholder='Rechercher un jeu...'
        onSearch={setSearchQuery}
      />
      <AdminList error={error} isLoading={isLoading}>
        <AdminDataTable<IGameData, GameSortField>
          selectable
          batchActions={renderBatchActions}
          columns={[
            {
              field: 'title',
              headerName: 'Titre',
              sortable: true,
              render: row => (
                <Link
                  className='hover:underline'
                  href={`/admin/games/${row.id}/view`}
                  style={{
                    color: 'var(--mui-palette-primary-main)',
                    textDecoration: 'none',
                  }}
                >
                  {row.title}
                </Link>
              ),
            },
            {
              field: 'developer',
              headerName: 'Développeur',
              render: row => row.developer.name,
            },
            {
              field: 'publisher',
              headerName: 'Éditeur',
              render: row => row.publisher.name,
            },
            {
              field: 'platforms',
              headerName: 'Plateformes',
              render: renderPlatforms,
              width: '250px',
            },
            {
              field: 'releaseDate',
              headerName: 'Date de sortie',
              render: row =>
                row.releaseDate ? dayjs(row.releaseDate).format('LL') : '-',
              width: '150px',
            },
            {
              field: 'actions',
              headerName: 'Actions',
              render: row => (
                <AdminActionButtons
                  actions={[
                    defaultActions.edit(`/admin/games/${row.id}/edit`),
                    defaultActions.delete(() =>
                      setDeleteDialog({
                        isOpen: true,
                        gameId: row.id,
                        isBatchDelete: false,
                      })
                    ),
                  ]}
                />
              ),
              width: '120px',
            },
          ]}
          getRowId={row => row.id}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          pages={pagination?.pages ?? 1}
          rows={filteredGames}
          selectedIds={selectedIds}
          sortField={sortField}
          sortOrder={sortOrder}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          onSelectionChange={setSelectedIds}
          onSort={handleSort}
        />
      </AdminList>
      <AdminDeleteDialog
        isLoading={false}
        isOpen={deleteDialog.isOpen}
        message={
          deleteDialog.isBatchDelete
            ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} jeux sélectionnés ?`
            : 'Êtes-vous sûr de vouloir supprimer ce jeu ?'
        }
        title='Supprimer le jeu'
        onClose={() =>
          setDeleteDialog({ isOpen: false, gameId: null, isBatchDelete: false })
        }
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminGamesPage;
