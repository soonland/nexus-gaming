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
import { ColorDot } from '@/components/common';
import { useNotifier } from '@/components/common/Notifier';
import { useGames, useDeleteGame } from '@/hooks/useGames';
import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types/api';

type GameSortField = keyof Pick<IGameData, 'title' | 'createdAt' | 'updatedAt'>;

interface IDeleteDialogState {
  isOpen: boolean;
  gameId: string | null;
}

const DEFAULT_PAGE_SIZE = 10;

const AdminGamesPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialogState>({
    isOpen: false,
    gameId: null,
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
  const isEmpty = !filteredGames.length;

  const handleDelete = async () => {
    if (deleteDialog.gameId) {
      try {
        await deleteGame.mutateAsync(deleteDialog.gameId);
        showSuccess('Jeu supprimé avec succès');
        setDeleteDialog({ isOpen: false, gameId: null });
      } catch (error) {
        console.error('Error deleting game:', error);
        showError('Une erreur est survenue lors de la suppression');
      }
    }
  };

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

  return (
    <AdminPageLayout
      actions={
        <AdminActions
          createHref='/admin/games/new'
          createLabel='Ajouter un jeu'
        />
      }
      title='Gestion des jeux'
    >
      <AdminFilters
        searchPlaceholder='Rechercher un jeu...'
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
      <AdminList
        emptyMessage='Aucun jeu trouvé'
        error={error}
        isEmpty={isEmpty}
        isLoading={isLoading}
      >
        <AdminDataTable<IGameData, GameSortField>
          columns={[
            {
              field: 'title',
              headerName: 'Titre',
              sortable: true,
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
                      })
                    ),
                  ]}
                />
              ),
              width: '120px',
            },
          ]}
          rows={filteredGames}
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
        message='Êtes-vous sûr de vouloir supprimer ce jeu ?'
        title='Supprimer le jeu'
        onClose={() => setDeleteDialog({ isOpen: false, gameId: null })}
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AdminGamesPage;
