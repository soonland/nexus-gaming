'use client';

import { Button, Stack } from '@mui/material';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';

import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { useAdminArticle } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import { canEditArticle, canViewArticle } from '@/lib/permissions';

import { ArticleView } from '../../_components/ArticleView';

const ArticleViewPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { article, isLoading } = useAdminArticle(params.id);

  if (!canViewArticle(user?.role)) {
    router.push('/admin/articles');
    return null;
  }

  if (isLoading) {
    return null; // ou un composant de chargement
  }

  if (!article) {
    notFound();
  }

  return (
    <AdminPageLayout
      actions={
        <Stack direction='row' spacing={2}>
          {canEditArticle(
            user?.role,
            {
              status: article.status,
              userId: article.user.id,
            },
            user?.id
          ) && (
            <Button
              color='primary'
              startIcon={<FiEdit2 />}
              variant='contained'
              onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
            >
              Modifier
            </Button>
          )}
          <Button
            startIcon={<FiArrowLeft />}
            variant='outlined'
            onClick={() => router.push('/admin/articles')}
          >
            Retour
          </Button>
        </Stack>
      }
      title={article.title}
    >
      <ArticleView article={article} />
    </AdminPageLayout>
  );
};

export default ArticleViewPage;
