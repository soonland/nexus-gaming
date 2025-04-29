'use client';

import { useParams } from 'next/navigation';

import { AdminList, AdminPageLayout } from '@/components/admin';
import { usePlatform } from '@/hooks/usePlatforms';

import { PlatformForm } from '../../_components/PlatformForm';

const EditPlatformPage = () => {
  const params = useParams();
  const { platform, isLoading, error } = usePlatform(params.id as string);

  return (
    <AdminPageLayout title='Modifier la plateforme'>
      <AdminList
        emptyMessage='Plateforme introuvable'
        error={error}
        isEmpty={!platform}
        isLoading={isLoading}
      >
        {platform && (
          <PlatformForm
            initialData={{
              id: platform.id,
              name: platform.name,
              manufacturer: platform.manufacturer,
              releaseDate: platform.releaseDate || null,
              color: platform.color,
            }}
            mode='edit'
          />
        )}
      </AdminList>
    </AdminPageLayout>
  );
};

export default EditPlatformPage;
