import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { GameData, GameForm } from '@/types';

interface IGamesResponse {
  games: GameData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface IGamesParams {
  page?: number;
  limit?: number;
  search?: string;
  admin?: boolean;
}

const gamesApi = {
  getAll: async (params: IGamesParams = {}) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
    const { data } = await axios.get(`/api/games?${queryParams.toString()}`);
    return data as IGamesResponse;
  },

  getById: async (id: string) => {
    const { data } = await axios.get(`/api/games/${id}`);
    return data as GameData;
  },

  create: async (data: GameForm) => {
    const response = await axios.post('/api/games', data);
    return response.data;
  },

  update: async (id: string, data: GameForm) => {
    const response = await axios.patch(`/api/games/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/api/games/${id}`);
  },
};

export function useGames(params: IGamesParams = {}) {
  const { data, isLoading, error } = useQuery<IGamesResponse>({
    queryKey: ['games', params],
    queryFn: () => gamesApi.getAll({ ...params, admin: params.admin ?? true }),
  });

  return {
    games: data?.games ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GameForm) => {
      const response = await axios.post('/api/games', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GameForm }) => {
      const response = await axios.patch(`/api/games/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game', id] });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gamesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useGame(id: string) {
  const {
    data: game,
    isLoading,
    error,
  } = useQuery<GameData>({
    queryKey: ['game', id],
    queryFn: () => gamesApi.getById(id),
    enabled: !!id,
  });

  return {
    game,
    isLoading,
    error,
  };
}
