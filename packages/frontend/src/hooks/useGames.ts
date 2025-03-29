import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '../services/api/client';
import { Game, GameFormData, GameWithDetails } from '../types/game';
import { useAuth } from '@/providers/AuthProvider';

const API_URL = '/games';

export const useGames = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuth();
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      const r = await api.get(API_URL);
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
      console.log('Creating game with data:', newGame);
      try {
        const { data } = await api.post(API_URL, newGame);
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 403) {
            // Refresh user data as role might have changed
            await fetchUser();
          }
          console.error('Error creating game:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        throw error;
      }
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
