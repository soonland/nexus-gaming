'use client';

import { AdminPageLayout } from '@/components/admin';

import { AnnouncementForm } from '../_components/AnnouncementForm';

const NewAnnouncementPage = () => {
  return (
    <AdminPageLayout title='Créer une annonce'>
      <AnnouncementForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewAnnouncementPage;
