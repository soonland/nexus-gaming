import type { ArticleStatus } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

import type { IArticleWithRelations } from '@/app/admin/articles/_components/form/types';
import type { IArticleData, ArticleForm, IArticleStatusUpdate } from '@/types';

interface IAdminArticleParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ArticleStatus;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

interface IPaginatedArticlesResponse {
  articles: IArticleData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

const adminArticlesApi = {
  getOne: async (id: string) => {
    const { data } = await axios.get(`/api/admin/articles/${id}`);
    return data as IArticleWithRelations;
  },

  checkSlug: async (slug: string, currentId?: string) => {
    const params = new URLSearchParams({
      slug,
      ...(currentId && { currentId }),
    });
    const { data } = await axios.get(
      `/api/admin/articles/check-slug?${params.toString()}`
    );
    return data as { exists: boolean; suggestion: string };
  },

  getAll: async (params: IAdminArticleParams = {}) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
    const { data } = await axios.get(
      `/api/admin/articles?${queryParams.toString()}`
    );
    return data as IPaginatedArticlesResponse;
  },

  create: async (data: ArticleForm) => {
    const response = await axios.post('/api/admin/articles', data);
    return response.data as IArticleData;
  },

  update: async (id: string, data: ArticleForm) => {
    const response = await axios.patch(`/api/admin/articles/${id}`, data);
    return response.data as IArticleData;
  },

  delete: async (id: string) => {
    await axios.delete(`/api/admin/articles/${id}`);
  },

  updateStatus: async (
    id: string,
    status: ArticleStatus,
    comment?: string,
    previousStatus?: string
  ) => {
    const response = await axios.patch(`/api/admin/articles/${id}/status`, {
      status,
      comment,
      previousStatus,
    } as IArticleStatusUpdate);
    return response.data as IArticleData;
  },
};

const queryKeys = {
  all: ['admin', 'articles'] as const,
  lists: (params: IAdminArticleParams = {}) =>
    [...queryKeys.all, params] as const,
  details: (id: string) => [...queryKeys.all, id] as const,
};

export function useAdminArticle(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery<IArticleWithRelations>({
    queryKey: queryKeys.details(id),
    queryFn: () => adminArticlesApi.getOne(id),
    enabled: !!id,
  });

  return {
    article,
    isLoading,
    error,
  };
}

export function useAdminArticles(params: IAdminArticleParams = {}) {
  const queryClient = useQueryClient();

  // Store current params to use in mutation callbacks
  const currentQueryKey = queryKeys.lists(params);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.lists(params),
    queryFn: () => adminArticlesApi.getAll(params),
  });

  const createArticle = useMutation({
    mutationFn: (data: ArticleForm) => adminArticlesApi.create(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
    },
  });

  const updateArticle = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleForm }) =>
      adminArticlesApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Only refetch the current query
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
      // Still refetch details if needed
      queryClient.refetchQueries({
        queryKey: queryKeys.details(id),
        exact: true,
      });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: (id: string) => adminArticlesApi.delete(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
    },
  });

  const updateArticleStatus = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
      previousStatus,
    }: {
      id: string;
      status: ArticleStatus;
      comment?: string;
      previousStatus?: ArticleStatus;
    }) => adminArticlesApi.updateStatus(id, status, comment, previousStatus),
    onSuccess: (_, { id }) => {
      // Only refetch the current query
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
      // Still refetch details if needed
      queryClient.refetchQueries({
        queryKey: queryKeys.details(id),
        exact: true,
      });
    },
  });

  const checkSlug = useMutation<
    { exists: boolean; suggestion: string },
    AxiosError,
    { slug: string; currentId?: string }
  >({
    mutationFn: ({ slug, currentId }) =>
      adminArticlesApi.checkSlug(slug, currentId),
  });

  return {
    articles: data?.articles ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    updateArticleStatus,
    checkSlug,
    isCreating: createArticle.isPending,
    isUpdating: updateArticle.isPending,
    isDeleting: deleteArticle.isPending,
    isUpdatingStatus: updateArticleStatus.isPending,
    isCheckingSlug: checkSlug.isPending,
  };
}
