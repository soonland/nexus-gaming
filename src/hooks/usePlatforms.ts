import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

import type { IPlatformData, IPlatformForm } from '@/types';

// Hook pour la liste des plateformes et les opérations CRUD
interface IPlatformsResponse {
  platforms: IPlatformData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface IPlatformsParams {
  page: number;
  limit: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export function usePlatforms({
  page,
  limit,
  search,
  sortField,
  sortOrder,
}: IPlatformsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<IPlatformsResponse, AxiosError>({
    queryKey: ['platforms', { page, limit, search, sortField, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append('search', search);
      if (sortField) params.append('sortField', sortField);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await axios.get(`/api/platforms?${params.toString()}`);
      return response.data;
    },
  });

  const createPlatform = useMutation({
    mutationFn: async (data: IPlatformForm) => {
      const response = await axios.post('/api/platforms', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['platforms'] });
    },
  });

  const updatePlatform = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IPlatformForm }) => {
      const response = await axios.patch(`/api/platforms/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['platforms'] });
      queryClient.refetchQueries({ queryKey: ['platform', variables.id] });
    },
  });

  const deletePlatform = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/platforms/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['platforms'] });
    },
  });

  return {
    platforms: data?.platforms ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    createPlatform: createPlatform.mutateAsync,
    updatePlatform: updatePlatform.mutateAsync,
    deletePlatform: deletePlatform.mutateAsync,
    isCreating: createPlatform.isPending,
    isUpdating: updatePlatform.isPending,
    isDeleting: deletePlatform.isPending,
  };
}

// Hook pour les détails d'une plateforme
export function usePlatform(id: string) {
  const {
    data: platform,
    isLoading,
    error,
  } = useQuery<IPlatformData, AxiosError>({
    queryKey: ['platform', id],
    queryFn: async () => {
      const response = await axios.get(`/api/platforms/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    platform,
    isLoading,
    error,
  };
}
