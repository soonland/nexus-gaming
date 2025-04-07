import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from '@/lib/dayjs'

import type { PlatformData, PlatformForm } from '@/types'

// Hook pour la liste des plateformes et les opérations CRUD
export function usePlatforms() {
  const queryClient = useQueryClient()

  const { data: platforms, isLoading } = useQuery<PlatformData[]>({
    queryKey: ['platforms'],
    queryFn: async () => {
      const response = await axios.get('/api/platforms')
      return response.data.map((platform: any) => ({
        ...platform,
        createdAt: dayjs(platform.createdAt).toDate(),
        updatedAt: dayjs(platform.updatedAt).toDate(),
        releaseDate: platform.releaseDate ? dayjs(platform.releaseDate).toDate() : null
      }))
    },
  })

  const createPlatform = useMutation({
    mutationFn: async (data: PlatformForm) => {
      const response = await axios.post('/api/platforms', data)
      const platform = response.data
      return {
        ...platform,
        createdAt: dayjs(platform.createdAt).toDate(),
        updatedAt: dayjs(platform.updatedAt).toDate(),
        releaseDate: platform.releaseDate ? dayjs(platform.releaseDate).toDate() : null
      }
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
      data: PlatformForm
    }) => {
      const response = await axios.patch(`/api/platforms/${id}`, data)
      const platform = response.data
      return {
        ...platform,
        createdAt: dayjs(platform.createdAt).toDate(),
        updatedAt: dayjs(platform.updatedAt).toDate(),
        releaseDate: platform.releaseDate ? dayjs(platform.releaseDate).toDate() : null
      }
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
  const { data: platform, isLoading } = useQuery<PlatformData>({
    queryKey: ['platform', id],
    queryFn: async () => {
      const response = await axios.get(`/api/platforms/${id}`)
      const platform = response.data
      return {
        ...platform,
        createdAt: dayjs(platform.createdAt).toDate(),
        updatedAt: dayjs(platform.updatedAt).toDate(),
        releaseDate: platform.releaseDate ? dayjs(platform.releaseDate).toDate() : null
      }
    },
    enabled: !!id,
  })

  return {
    platform,
    isLoading,
  }
}
