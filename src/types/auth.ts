import { Role } from '@prisma/client'
import type { JWTPayload as JoseJWTPayload } from 'jose'

export type AuthUser = {
  id: string
  email: string
  username: string
  role: Role
  isActive: boolean
  lastPasswordChange: string
  passwordExpiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface JWTPayload extends JoseJWTPayload {
  sub: string // user id
  email: string
  username: string
  role: string
  isActive: boolean
  lastPasswordChange: string
  passwordExpiresAt: string
}
