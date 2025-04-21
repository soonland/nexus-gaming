'use client';

import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/components/admin';
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';

import { AnnouncementForm } from '../../_components/AnnouncementForm';

const EditAnnouncementPage = () => {
  const params = useParams();
  const { announcement } = useAdminAnnouncement(params.id as string);

  if (!announcement) {
    return null;
  }

  return (
    <AdminPageLayout title='Modifier une annonce'>
      <AnnouncementForm initialData={announcement} mode='edit' />
    </AdminPageLayout>
  );
};

export default EditAnnouncementPage;
