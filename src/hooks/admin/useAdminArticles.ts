import type { ArticleStatus } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { ArticleWithRelations } from '@/app/admin/articles/_components/form/types';
import type { IArticleData, ArticleForm } from '@/types';

interface IAdminArticleParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ArticleStatus;
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
    return data as ArticleWithRelations;
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

  updateStatus: async (id: string, status: ArticleStatus) => {
    const response = await axios.patch(`/api/admin/articles/${id}/status`, {
      status,
    });
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
  } = useQuery<ArticleWithRelations>({
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

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.lists(params),
    queryFn: () => adminArticlesApi.getAll(params),
  });

  const createArticle = useMutation({
    mutationFn: (data: ArticleForm) => adminArticlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });

  const updateArticle = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleForm }) =>
      adminArticlesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.details(id) });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: (id: string) => adminArticlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });

  const updateArticleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ArticleStatus }) =>
      adminArticlesApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.details(id) });
    },
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
    isCreating: createArticle.isPending,
    isUpdating: updateArticle.isPending,
    isDeleting: deleteArticle.isPending,
    isUpdatingStatus: updateArticleStatus.isPending,
  };
}
