import { FastifyRequest } from 'fastify'

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
    role: 'USER' | 'ADMIN'
    email: string
  }
}
