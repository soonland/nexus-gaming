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
  // Configurer le préfixe global /api
  await server.register(async function (fastify) {
    // Health check route
    fastify.get('/health', async () => {
      return { status: 'ok' }
    })

    // Register route groups
    await fastify.register(authRoutes, { prefix: '/auth' })
    await fastify.register(gameRoutes, { prefix: '/games' })
    await fastify.register(reviewRoutes, { prefix: '/reviews' })
    await fastify.register(articleRoutes, { prefix: '/articles' })
    await fastify.register(platformRoutes, { prefix: '/platforms' })
    await fastify.register(categoryRoutes, { prefix: '/categories' })
    await fastify.register(companyRoutes, { prefix: '/companies' })
  }, { prefix: '/api' })
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
