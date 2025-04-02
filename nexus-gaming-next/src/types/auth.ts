import { Role, User } from '@prisma/client'

export type AuthUser = {
  id: string
  email: string
  username: string
  role: Role
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface JWTPayload {
  sub: string // user id
  email: string
  username: string
  role: string
}
