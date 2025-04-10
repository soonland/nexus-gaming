import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { Category } from '@prisma/client'
import type { CategoryData, CategoryForm } from '@/types'

// Hook principal pour la gestion des catégories
export function useCategories() {
  const queryClient = useQueryClient()

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories')
      return response.data
    },
  })

  const createCategory = useMutation({
    mutationFn: async (data: CategoryForm) => {
      const response = await axios.post('/api/categories', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: CategoryForm
    }) => {
      const response = await axios.patch(`/api/categories/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return {
    categories,
    error,
    isLoading,
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    deleteCategory: deleteCategory.mutate,
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    isDeleting: deleteCategory.isPending,
  }
}

// Hook pour les détails d'une catégorie
export function useCategory(id: string) {
  const {
    data: category,
    isLoading,
    error,
  } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await axios.get(`/api/categories/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  return {
    category,
    isLoading,
    error,
  }
}
