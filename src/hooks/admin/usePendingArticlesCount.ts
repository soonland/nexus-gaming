import { ArticleStatus } from '@prisma/client';

import { useAdminArticles } from './useAdminArticles';

export const usePendingArticlesCount = () => {
  const { articles, isLoading } = useAdminArticles({
    status: ArticleStatus.PENDING_APPROVAL,
  });

  return {
    count: articles?.length ?? 0,
    isLoading,
  };
};
