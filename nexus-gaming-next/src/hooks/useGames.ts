import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Game as PrismaGame } from '@prisma/client'
import { GameWithRelations } from '@/types/game'

interface GameFormData {
  title: string
  description: string
  releaseDate?: string
  developerId: string
  publisherId: string
  coverImage?: string
  platformIds: string[]
}

// Hook principal pour la gestion des jeux
export function useGames() {
  const queryClient = useQueryClient()

  const {
    data: games,
    isLoading,
    error,
  } = useQuery<GameWithRelations[]>({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await axios.get('/api/games')
      return response.data
    },
  })

  const createGame = useMutation({
    mutationFn: async (data: GameFormData) => {
      const response = await axios.post('/api/games', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })

  const updateGame = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: GameFormData
    }) => {
      const response = await axios.patch(`/api/games/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })

  const deleteGame = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/games/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })

  return {
    games,
    error,
    isLoading,
    createGame: createGame.mutate,
    updateGame: updateGame.mutate,
    deleteGame: deleteGame.mutate,
    isCreating: createGame.isPending,
    isUpdating: updateGame.isPending,
    isDeleting: deleteGame.isPending,
  }
}

// Hook pour les détails d'un jeu
export function useGame(id: string) {
  const {
    data: game,
    isLoading,
    error,
  } = useQuery<GameWithRelations>({
    queryKey: ['game', id],
    queryFn: async () => {
      const response = await axios.get(`/api/games/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  return {
    game,
    isLoading,
    error,
  }
}
