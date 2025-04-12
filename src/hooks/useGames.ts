import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { GameData, GameForm } from '@/types';

interface GamesResponse {
  games: GameData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface GamesParams {
  page?: string;
  limit?: string;
  search?: string;
}

export function useGames(params: GamesParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<GamesResponse>({
    queryKey: ['games', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });
      const response = await axios.get(`/api/games?${queryParams.toString()}`);
      return response.data;
    },
  });

  const createGame = useMutation({
    mutationFn: async (data: GameForm) => {
      const response = await axios.post('/api/games', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const updateGame = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GameForm }) => {
      const response = await axios.patch(`/api/games/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const deleteGame = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/games/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    createGame: async (data: GameForm) => {
      return createGame.mutateAsync(data);
    },
    updateGame: async (id: string, data: GameForm) => {
      return updateGame.mutateAsync({ id, data });
    },
    deleteGame: async (id: string) => {
      return deleteGame.mutateAsync(id);
    },
    isCreating: createGame.isPending,
    isUpdating: updateGame.isPending,
    isDeleting: deleteGame.isPending,
  };
}

export function useGame(id: string) {
  const {
    data: game,
    isLoading,
    error,
  } = useQuery<GameData>({
    queryKey: ['game', id],
    queryFn: async () => {
      const response = await axios.get(`/api/games/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    game,
    isLoading,
    error,
  };
}
