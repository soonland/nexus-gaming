import type { ArticleStatus } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { IArticleData } from '@/types';

interface IArticleStatusUpdate {
  status: ArticleStatus;
  comment?: string;
}

const updateArticleStatus = async (
  articleId: string,
  { status, comment }: IArticleStatusUpdate
) => {
  const { data } = await axios.patch(
    `/api/admin/articles/${articleId}/status`,
    {
      status,
      comment,
    }
  );
  return data as IArticleData;
};

export function useArticleStatusTransition(articleId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: IArticleStatusUpdate) =>
      updateArticleStatus(articleId, data),
    onSuccess: () => {
      // Invalidate queries for article list and details
      queryClient.invalidateQueries({ queryKey: ['admin', 'articles'] });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'articles', articleId],
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', articleId] });
    },
  });

  const updateStatus = async (status: ArticleStatus, comment?: string) => {
    return mutate({ status, comment });
  };

  return {
    updateStatus,
    isUpdating: isPending,
    error: error,
  };
}
