'use client';

import { Skeleton, Stack } from '@mui/material';
import { Suspense } from 'react';
import { FiPlus as AddIcon, FiTrash2 } from 'react-icons/fi';

import { AdminActions, AdminPageLayout } from '@/components/admin';
import type { IActionButton } from '@/components/admin/common';
import { useAuth } from '@/hooks';
import { hasSufficientRole } from '@/lib/permissions';

import { ArticlesContent } from './_components';

const LoadingFallback = () => (
  <Stack spacing={2}>
    <Skeleton height={56} variant='rectangular' />
    <Skeleton height={400} variant='rectangular' />
  </Stack>
);

const AdminArticlesPage = () => {
  const { user } = useAuth();

  const actions: IActionButton[] = [
    {
      label: 'Ajouter un article',
      icon: AddIcon,
      href: '/admin/articles/new',
      variant: 'contained',
    },
    {
      label: 'Corbeille',
      icon: FiTrash2,
      href: '/admin/articles/trash',
      variant: 'outlined',
      disabled: !hasSufficientRole(user?.role, 'SENIOR_EDITOR'),
    },
  ];

  return (
    <AdminPageLayout
      actions={<AdminActions actions={actions} />}
      title='Gestion des articles'
    >
      <Suspense fallback={<LoadingFallback />}>
        <ArticlesContent />
      </Suspense>
    </AdminPageLayout>
  );
};

export default AdminArticlesPage;
