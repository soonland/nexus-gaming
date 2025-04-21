'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AdminPageLayout } from '@/components/admin';
import { useGame } from '@/hooks/useGames';

import { GameForm } from '../../_components/GameForm';

const EditGamePage = () => {
  const params = useParams();
  const router = useRouter();
  const { game, isLoading, error } = useGame(params.id as string);

  useEffect(() => {
    if (error) {
      console.error('Error loading game:', error);
      router.push('/admin/games');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <AdminPageLayout title='Modifier un jeu'>
        <div>Chargement...</div>
      </AdminPageLayout>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <AdminPageLayout title='Modifier un jeu'>
      <GameForm
        initialData={{
          id: game.id,
          title: game.title,
          description: game.description,
          releaseDate: game.releaseDate,
          coverImage: game.coverImage,
          developer: game.developer,
          publisher: game.publisher,
          genre: game.genre,
          platforms: game.platforms,
        }}
        mode='edit'
      />
    </AdminPageLayout>
  );
};

export default EditGamePage;
