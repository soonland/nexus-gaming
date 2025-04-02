import { useQuery } from '@tanstack/react-query'
import type { Article, User, Category, Game } from '@prisma/client'

type ArticleWithRelations = Omit<Article, 'userId' | 'categoryId'> & {
  user: Pick<User, 'username'>
  category: Pick<Category, 'name'> | null
  games: Pick<Game, 'id' | 'title' | 'coverImage'>[]
}

export const ARTICLES_QUERY_KEY = ['articles'] as const

async function fetchArticles(): Promise<ArticleWithRelations[]> {
  const response = await fetch('/api/articles')
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Failed to fetch articles')
  }
  return response.json()
}

export function useArticles() {
  return useQuery<ArticleWithRelations[], Error>({
    queryKey: ARTICLES_QUERY_KEY,
    queryFn: fetchArticles,
    retry: 2,
    staleTime: 1000 * 60, // 1 minute
  })
}
