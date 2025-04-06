import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { ArticleData, ArticleForm } from '@/types'

export function useArticles() {
  const queryClient = useQueryClient()

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<ArticleData[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axios.get('/api/articles')
      return response.data
    },
  })

  const createArticle = useMutation({
    mutationFn: async (data: ArticleForm) => {
      const response = await axios.post('/api/articles', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  const updateArticle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ArticleForm }) => {
      const response = await axios.patch(`/api/articles/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/articles/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  return {
    articles,
    isLoading,
    error,
    createArticle: async (data: ArticleForm) => {
      return createArticle.mutateAsync(data)
    },
    updateArticle: async (id: string, data: ArticleForm) => {
      return updateArticle.mutateAsync({ id, data })
    },
    deleteArticle: async (id: string) => {
      return deleteArticle.mutateAsync(id)
    },
    isCreating: createArticle.isPending,
    isUpdating: updateArticle.isPending,
    isDeleting: deleteArticle.isPending,
  }
}

export function useArticle(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery<ArticleData>({
    queryKey: ['article', id],
    queryFn: async () => {
      const response = await axios.get(`/api/articles/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  return {
    article,
    isLoading,
    error,
  }
}
