'use client';

import { AdminPageLayout } from '@/components/admin';

import { GameForm } from '../_components/GameForm';

const NewGamePage = () => {
  return (
    <AdminPageLayout title='Nouveau jeu'>
      <GameForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewGamePage;
