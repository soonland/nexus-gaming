'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { use } from 'react';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';

import { AccessDenied } from '@/components/admin/common/AccessDenied';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { LoadingOverlay } from '@/components/common';
import { useAdminArticle } from '@/hooks/admin/useAdminArticles';
import { useAuth } from '@/hooks/useAuth';
import { canEditArticle, canViewArticle } from '@/lib/permissions';

import { ArticleView } from '../../_components/ArticleView';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const ArticleViewPage = ({ params }: IPageProps) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { id } = use(params);
  const { article, isLoading } = useAdminArticle(id);

  if (isLoadingAuth || isLoading) {
    return <LoadingOverlay isLoading={isLoadingAuth || isLoading} />;
  }

  if (!canViewArticle(user?.role)) {
    return (
      <AccessDenied
        message="Vous n'avez pas les permissions nécessaires pour voir cet article"
        returnLabel='Retour à la liste des articles'
        returnPath='/admin/articles'
      />
    );
  }

  if (!article) {
    return (
      <AccessDenied
        message="L'article que vous essayez de voir n'existe pas"
        returnLabel='Retour à la liste des articles'
        returnPath='/admin/articles'
      />
    );
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
              component={Link}
              href={`/admin/articles/${article.id}/edit`}
              startIcon={<FiEdit2 />}
              variant='contained'
            >
              Modifier
            </Button>
          )}
          <Button
            component={Link}
            href='/admin/articles'
            startIcon={<FiArrowLeft />}
            variant='outlined'
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
