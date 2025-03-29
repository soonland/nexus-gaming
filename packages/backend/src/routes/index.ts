import { FastifyReply, FastifyRequest } from 'fastify'
import { FastifyServerInstance } from '../types/server'
import { authRoutes } from './auth'
import { gameRoutes } from './games'
import { reviewRoutes } from './reviews'
import { articleRoutes } from './articles'
import { platformRoutes } from './platforms'
import categoryRoutes from './categories'
import companyRoutes from './companies'

export async function configureRoutes(server: FastifyServerInstance) {
  // Health check route
  server.get('/health', async () => {
    return { status: 'ok' }
  })

  // Register route groups
  server.register(authRoutes, { prefix: '/auth' })
  server.register(gameRoutes, { prefix: '/games' })
  server.register(reviewRoutes, { prefix: '/reviews' })
  server.register(articleRoutes, { prefix: '/articles' })
  server.register(platformRoutes, { prefix: '/platforms' })
  server.register(categoryRoutes, { prefix: '/categories' })
  server.register(companyRoutes, { prefix: '/companies' })
}

// Types for route handlers
export type AuthenticatedHandler<T> = {
  Headers: {
    authorization: string
  }
  Reply: T
}

// Helper to ensure user is authenticated
export const ensureAuthenticated = async (
  server: FastifyServerInstance,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
}
