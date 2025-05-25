'use client';

import { Skeleton, Stack } from '@mui/material';
import { Suspense } from 'react';

import { AdminPageLayout } from '@/components/admin';

import { ArticlesContent } from './_components';

const LoadingFallback = () => (
  <Stack spacing={2}>
    <Skeleton height={56} variant='rectangular' />
    <Skeleton height={400} variant='rectangular' />
  </Stack>
);

const AdminArticlesPage = () => {
  return (
    <AdminPageLayout title='Gestion des articles'>
      <Suspense fallback={<LoadingFallback />}>
        <ArticlesContent />
      </Suspense>
    </AdminPageLayout>
  );
};

export default AdminArticlesPage;
