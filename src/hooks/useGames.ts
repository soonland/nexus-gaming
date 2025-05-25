import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { IGameData, IGameForm } from '@/types';

interface IGamesResponse {
  games: IGameData[];
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
    return data as IGameData;
  },

  create: async (data: IGameForm) => {
    const response = await axios.post('/api/games', data);
    return response.data;
  },

  update: async (id: string, data: IGameForm) => {
    const response = await axios.put(`/api/games/${id}`, data);
    return response.data;
  },

  updatePartial: async (id: string, data: Partial<IGameForm>) => {
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
    mutationFn: async (data: IGameForm) => {
      const response = await axios.post('/api/games', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['games'] });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  const updateGame = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IGameForm }) => {
      const response = await axios.put(`/api/games/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.refetchQueries({ queryKey: ['games'] });
      queryClient.refetchQueries({ queryKey: ['game', id] });
    },
  });

  const updatePartialGame = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<IGameForm>;
    }) => {
      const response = await axios.patch(`/api/games/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.refetchQueries({ queryKey: ['games'] });
      queryClient.refetchQueries({ queryKey: ['game', id] });
    },
  });

  return {
    ...updateGame,
    updatePartial: updatePartialGame,
  };
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gamesApi.delete,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['games'] });
    },
  });
}

export function useGame(id: string) {
  const {
    data: game,
    isLoading,
    error,
  } = useQuery<IGameData>({
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
