import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../services/api/client';
import { Platform, PlatformFormData, PlatformWithGames } from '../types/platform';
import { useAuth } from '@/providers/AuthProvider';

const API_URL = '/platforms';

export const usePlatforms = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuth();

  const { data: platforms = [], isLoading } = useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: async () => {
      const r = await api.get(API_URL);
      return r.data;
    },
  });

  const createPlatformMutation = useMutation({
    mutationFn: async (newPlatform: PlatformFormData) => {
      try {
        const { data } = await api.post(API_URL, newPlatform);
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 403) {
            // Refresh user data as role might have changed
            await fetchUser();
          }
          console.error('Error creating platform:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });

  const updatePlatformMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PlatformFormData }) => {
      const response = await api.patch(`${API_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      queryClient.invalidateQueries({ queryKey: ['platformDetails'] });
    },
  });

  const deletePlatformMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });

  return {
    platforms,
    isLoading,
    createPlatform: createPlatformMutation.mutateAsync,
    updatePlatform: updatePlatformMutation.mutateAsync,
    deletePlatform: deletePlatformMutation.mutateAsync,
    isCreating: createPlatformMutation.isPending,
    isUpdating: updatePlatformMutation.isPending,
    isDeleting: deletePlatformMutation.isPending,
  };
};

export const usePlatformDetails = (id: string) => {
  const { data: platform, isLoading } = useQuery<PlatformWithGames>({
    queryKey: ['platformDetails', id],
    queryFn: async () => {
      const { data } = await api.get(`${API_URL}/${id}`);
      return data;
    },
  });

  return {
    platform,
    isLoading,
  };
};
