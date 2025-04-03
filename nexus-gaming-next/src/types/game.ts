import { Game } from '@prisma/client'

type GameBase = Omit<Game, 'createdAt' | 'updatedAt' | 'releaseDate'> & {
  createdAt: string
  updatedAt: string
  releaseDate: string | null
}

export type GameWithRelations = GameBase & {
  platforms: { name: string }[]
  developer: { name: string }
  publisher: { name: string }
}
