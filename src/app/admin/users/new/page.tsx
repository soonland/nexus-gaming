'use client';

import { AdminPageLayout } from '@/components/admin';

import { UserForm } from '../_components/UserForm';

const NewUserPage = () => {
  return (
    <AdminPageLayout title='Créer un utilisateur'>
      <UserForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewUserPage;
