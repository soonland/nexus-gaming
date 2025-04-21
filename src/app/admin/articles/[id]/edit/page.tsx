'use client';

import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/components/admin';
import { useAdminArticle } from '@/hooks/admin/useAdminArticles';

import { ArticleForm } from '../../_components/ArticleForm';

const EditArticlePage = () => {
  const params = useParams();
  const { article } = useAdminArticle(params.id as string);

  if (!article) {
    return null;
  }

  return (
    <AdminPageLayout title='Modifier un article'>
      <ArticleForm initialData={article} mode='edit' />
    </AdminPageLayout>
  );
};

export default EditArticlePage;
