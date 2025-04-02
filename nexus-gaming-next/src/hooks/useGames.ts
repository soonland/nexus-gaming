import { useQuery } from '@tanstack/react-query'
import type { Game } from '@prisma/client'

type GameWithRelations = Game & {
  platforms: { name: string }[]
  developer: { name: string }
  publisher: { name: string }
}

export const GAMES_QUERY_KEY = ['games'] as const

async function fetchGames(): Promise<GameWithRelations[]> {
  const response = await fetch('/api/games')
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Failed to fetch games')
  }
  return response.json()
}

export function useGames() {
  return useQuery<GameWithRelations[], Error>({
    queryKey: GAMES_QUERY_KEY,
    queryFn: fetchGames,
    retry: 2,
    staleTime: 1000 * 60, // 1 minute
  })
}
