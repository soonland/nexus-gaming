import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Article as PrismaArticle, User, Category, Game } from '@prisma/client'

export type ArticleWithRelations = Omit<PrismaArticle, 'userId' | 'categoryId'> & {
  user: Pick<User, 'username'>
  category: Pick<Category, 'id' | 'name'> | null
  games: Pick<Game, 'id' | 'title' | 'coverImage'>[]
}

export interface ArticleFormData {
  title: string
  content: string
  categoryId?: string
  gameIds: string[]
}

// Hook principal pour la gestion des articles
export function useArticles() {
  const queryClient = useQueryClient()

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<ArticleWithRelations[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axios.get('/api/articles')
      return response.data
    },
  })

  const createArticle = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await axios.post('/api/articles', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  const updateArticle = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: ArticleFormData
    }) => {
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
    error,
    isLoading,
    createArticle: createArticle.mutate,
    updateArticle: updateArticle.mutate,
    deleteArticle: deleteArticle.mutate,
    isCreating: createArticle.isPending,
    isUpdating: updateArticle.isPending,
    isDeleting: deleteArticle.isPending,
  }
}

// Hook pour les détails d'un article
export function useArticle(id: string) {
  const { data: article, isLoading } = useQuery<ArticleWithRelations>({
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
  }
}
