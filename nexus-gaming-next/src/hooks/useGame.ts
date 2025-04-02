import { useQuery } from '@tanstack/react-query'
import type { Game, Platform, Company, Article, Review, User, Category } from '@prisma/client'

type RelatedArticle = Pick<Article, 'id' | 'title' | 'content' | 'publishedAt'> & {
  category: Pick<Category, 'name'> | null
  user: Pick<User, 'username'>
}

type GameReview = Pick<Review, 'id' | 'rating' | 'content' | 'createdAt'> & {
  user: Pick<User, 'username'>
}

type GameWithRelations = Omit<Game, 'developerId' | 'publisherId'> & {
  platforms: Pick<Platform, 'id' | 'name' | 'manufacturer' | 'releaseDate'>[]
  developer: Pick<Company, 'id' | 'name'>
  publisher: Pick<Company, 'id' | 'name'>
  articles: RelatedArticle[]
  reviews: GameReview[]
}

export const GAME_QUERY_KEY = 'game'

async function fetchGame(id: string): Promise<GameWithRelations> {
  const response = await fetch(`/api/games/${id}`)
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Failed to fetch game')
  }
  return response.json()
}

export function useGame(id: string) {
  return useQuery({
    queryKey: [GAME_QUERY_KEY, id],
    queryFn: () => fetchGame(id),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
