import { GameWithDetails } from '../../types/game'
import { api } from './client'

export const getGame = async (id: string) => {
  return api.get<GameWithDetails>(`/games/${id}`)
}

export const getGames = async () => {
  return api.get<GameWithDetails[]>('/games')
}
