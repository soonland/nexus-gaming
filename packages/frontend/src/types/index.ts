export interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'ADMIN'
}

export interface Game {
  id: string
  title: string
  description: string
  releaseDate: string
  platform: string[]
  publisher: string
  developer: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  rating: number
  content: string
  gameId: string
  userId: string
  user: User
  game: Game
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  content: string
  userId: string
  user: User
  games: Game[]
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
}

export interface AuthResponse {
  token: string
  user: User
}

export type ApiResponse<T> = {
  data: T
  message?: string
}
