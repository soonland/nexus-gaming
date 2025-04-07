import { Game, Article, Platform, Category, Company, User } from '@prisma/client'

// Enums et constantes
export type ArticleStatus = 'DRAFT' | 'PUBLISHED'

// Types de base avec relations
type WithId = {
  id: string
  name: string
}

type GameRef = {
  id: string
  title: string
  coverImage?: string | null
}

type UserRef = {
  id: string
  username: string
}

// Types pour les données
export type CategoryData = Omit<Category, 'createdAt' | 'updatedAt'> & {
  articleCount: number
  createdAt: Date
  updatedAt: Date
}

export type GameData = Omit<Game, 'createdAt' | 'updatedAt' | 'releaseDate'> & {
  platforms: WithId[]
  articles: WithId[]
  createdAt: Date
  updatedAt: Date
  releaseDate: Date | null
  developer: CompanyData
  publisher: CompanyData
}

export type ArticleData = Omit<Article, 'userId' | 'categoryId' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  category: WithId
  user: UserRef
  games: GameRef[]
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export type PlatformData = Omit<Platform, 'createdAt' | 'updatedAt' | 'releaseDate'> & {
  games: GameRef[]
  createdAt: Date
  updatedAt: Date
  releaseDate: Date | null
}

export type CompanyData = Company & {
  _count?: {
    gamesAsDev: number
    gamesAsPub: number
  }
}

export type CompanyWithGamesData = CompanyData & {
  gamesAsDev: GameRef[]
  gamesAsPub: GameRef[]
}

// Types pour les formulaires
export type GameForm = {
  title: string
  description?: string | null
  releaseDate?: string | null
  coverImage?: string | null
  platformIds: string[]
  developerId: string
  publisherId: string
}

export type ArticleForm = {
  title: string
  content: string
  categoryId: string
  gameIds?: string[]
  status?: ArticleStatus
  publishedAt?: string | null
}

export type PlatformForm = {
  name: string
  manufacturer: string
  releaseDate?: string | null
}

export type CompanyForm = {
  name: string
  isDeveloper: boolean
  isPublisher: boolean
}

export type CategoryForm = {
  name: string
}
