import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { IArticleData } from '@/types';

interface IArticleParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED';
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

const articlesApi = {
  getAll: async (params: IArticleParams = {}) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
    const { data } = await axios.get(`/api/articles?${queryParams.toString()}`);
    return data as IPaginatedArticlesResponse;
  },

  getById: async (id: string) => {
    const { data } = await axios.get(`/api/articles/${id}`);
    return data as IArticleData;
  },
};

export function useArticles(params: IArticleParams = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesApi.getAll(params),
  });

  return {
    articles: data?.articles ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}

export function useArticle(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.getById(id),
    enabled: Boolean(id),
  });

  return {
    article,
    isLoading,
    error,
  };
}
