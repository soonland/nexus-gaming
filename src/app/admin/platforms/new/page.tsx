'use client';

import { AdminPageLayout } from '@/components/admin';

import { PlatformForm } from '../_components/PlatformForm';

const NewPlatformPage = () => {
  return (
    <AdminPageLayout title='Nouvelle plateforme'>
      <PlatformForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewPlatformPage;
