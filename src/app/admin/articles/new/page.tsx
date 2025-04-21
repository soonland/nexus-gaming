'use client';

import { AdminPageLayout } from '@/components/admin';

import { ArticleForm } from '../_components/ArticleForm';

const NewArticlePage = () => {
  return (
    <AdminPageLayout title='Créer un article'>
      <ArticleForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewArticlePage;
