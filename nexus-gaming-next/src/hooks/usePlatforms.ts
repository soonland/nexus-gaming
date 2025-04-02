import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Platform {
  id: string
  name: string
  manufacturer: string
  releaseDate: string | null
  games?: {
    id: string
    title: string
  }[]
}

interface PlatformFormData {
  name: string
  manufacturer: string
  releaseDate?: string | null
}

// Hook pour la liste des plateformes et les opérations CRUD
export function usePlatforms() {
  const queryClient = useQueryClient()

  const { data: platforms, isLoading } = useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: async () => {
      const response = await axios.get('/api/platforms')
      return response.data
    },
  })

  const createPlatform = useMutation({
    mutationFn: async (data: PlatformFormData) => {
      const response = await axios.post('/api/platforms', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    },
  })

  const updatePlatform = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: PlatformFormData
    }) => {
      const response = await axios.patch(`/api/platforms/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    },
  })

  const deletePlatform = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/platforms/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
    },
  })

  return {
    platforms,
    isLoading,
    createPlatform: createPlatform.mutate,
    updatePlatform: updatePlatform.mutate,
    deletePlatform: deletePlatform.mutate,
    isCreating: createPlatform.isPending,
    isUpdating: updatePlatform.isPending,
    isDeleting: deletePlatform.isPending,
  }
}

// Hook pour les détails d'une plateforme
export function usePlatform(id: string) {
  const { data: platform, isLoading } = useQuery<Platform>({
    queryKey: ['platform', id],
    queryFn: async () => {
      const response = await axios.get(`/api/platforms/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  return {
    platform,
    isLoading,
  }
}
