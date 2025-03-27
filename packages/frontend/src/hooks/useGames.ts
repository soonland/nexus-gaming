import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api/client';
import { Game, GameFormData, GameWithDetails } from '../types/game';

const API_URL = '/games';

export const useGames = () => {
  const queryClient = useQueryClient();
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      const r = await api.get(API_URL);
      console.log("r", r);
      return r.data;
    },
  });

  const { data: gameDetails, isLoading: isLoadingDetails } = useQuery<GameWithDetails | null>({
    queryKey: ['gameDetails'],
    queryFn: async () => null,
    enabled: false,
  });

  const createGameMutation = useMutation({
    mutationFn: async (newGame: GameFormData) => {
      const { data } = await api.post(API_URL, newGame);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GameFormData }) => {
      const response = await api.patch(`${API_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['gameDetails'] });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    games,
    isLoading,
    gameDetails,
    isLoadingDetails,
    createGame: createGameMutation.mutateAsync,
    updateGame: updateGameMutation.mutateAsync,
    deleteGame: deleteGameMutation.mutateAsync,
    isCreating: createGameMutation.isPending,
    isUpdating: updateGameMutation.isPending,
    isDeleting: deleteGameMutation.isPending,
  };
};

export const useGameDetails = (id: string) => {
  const { data: game, isLoading } = useQuery<GameWithDetails>({
    queryKey: ['gameDetails', id],
    queryFn: async () => {
      const { data } = await api.get(`${API_URL}/${id}`);
      return data;
    },
  });

  return {
    game,
    isLoading,
  };
};
