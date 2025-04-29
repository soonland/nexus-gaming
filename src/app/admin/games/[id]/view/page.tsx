'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { use } from 'react';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';

import { AccessDenied } from '@/components/admin/common/AccessDenied';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { LoadingOverlay } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useGame } from '@/hooks/useGame';
import dayjs from '@/lib/dayjs';
import { canEditGames } from '@/lib/permissions';

import { GameView } from '../../_components/GameView';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const GameViewPage = ({ params }: IPageProps) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { id } = use(params);
  const { data: game, isLoading } = useGame(id);

  if (isLoadingAuth || isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  if (!canEditGames(user?.role)) {
    return (
      <AccessDenied
        message="Vous n'avez pas les permissions nécessaires pour voir ce jeu"
        returnLabel='Retour à la liste des jeux'
        returnPath='/admin/games'
      />
    );
  }

  if (!game) {
    return (
      <AccessDenied
        message="Le jeu que vous essayez de voir n'existe pas"
        returnLabel='Retour à la liste des jeux'
        returnPath='/admin/games'
      />
    );
  }

  return (
    <AdminPageLayout
      actions={
        <Stack direction='row' spacing={2}>
          {canEditGames(user?.role) && (
            <Button
              color='primary'
              component={Link}
              href={`/admin/games/${game.id}/edit`}
              startIcon={<FiEdit2 />}
              variant='contained'
            >
              Modifier
            </Button>
          )}
          <Button
            component={Link}
            href='/admin/games'
            startIcon={<FiArrowLeft />}
            variant='outlined'
          >
            Retour
          </Button>
        </Stack>
      }
      title={game.title}
    >
      <GameView
        game={{
          id: game.id,
          title: game.title,
          description: game.description || undefined,
          coverImage: game.coverImage || undefined,
          genre: game.genre || undefined,
          releaseDate: game.releaseDate
            ? dayjs(game.releaseDate).format()
            : undefined,
          developer: {
            id: game.developer.id,
            name: game.developer.name,
            isDeveloper: true,
            isPublisher: false,
            createdAt: dayjs(game.developer.createdAt).format(),
            updatedAt: dayjs(game.developer.updatedAt).format(),
          },
          publisher: {
            id: game.publisher.id,
            name: game.publisher.name,
            isDeveloper: false,
            isPublisher: true,
            createdAt: dayjs(game.publisher.createdAt).format(),
            updatedAt: dayjs(game.publisher.updatedAt).format(),
          },
          platforms: game.platforms.map(p => ({
            id: p.id,
            name: p.name,
            manufacturer: p.manufacturer,
            releaseDate: p.releaseDate ? dayjs(p.releaseDate).format() : null,
            createdAt: dayjs(p.createdAt).format(),
            updatedAt: dayjs(p.updatedAt).format(),
            color: p.color,
          })),
          createdAt: dayjs(game.createdAt).format(),
          updatedAt: dayjs(game.updatedAt).format(),
        }}
      />
    </AdminPageLayout>
  );
};

export default GameViewPage;
