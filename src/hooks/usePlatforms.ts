import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

import type { IPlatformData, IPlatformForm } from '@/types/api';

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

export function usePlatforms({ page, limit }: { page: number; limit: number }) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<IPlatformsResponse, AxiosError>({
    queryKey: ['platforms', { page, limit }],
    queryFn: async () => {
      const response = await axios.get(
        `/api/platforms?page=${page}&limit=${limit}`
      );
      return response.data;
    },
  });

  const createPlatform = useMutation({
    mutationFn: async (data: IPlatformForm) => {
      const response = await axios.post('/api/platforms', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });

  const updatePlatform = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IPlatformForm }) => {
      const response = await axios.patch(`/api/platforms/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });

  const deletePlatform = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/platforms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
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
