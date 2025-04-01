import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import prisma from '../src/lib/prismaClient'

export function createServer() {
  // Ensure database connection is properly closed
  const handleExit = async () => {
    try {
      await prisma.$disconnect()
    } catch (e) {
      console.error('Error during cleanup:', e)
    }
  }

  process.on('beforeExit', handleExit)
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)

  // Create Fastify instance
  const app = fastify({
    logger: true
  }).withTypeProvider<TypeBoxTypeProvider>()

  // Add Prisma to Fastify instance
  app.decorate('prisma', prisma)

  // Add JWT verification decorator
  app.decorate('authenticate', async function(request: any, reply: any) {
    try {
      await request.jwtVerify()
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        select: { id: true, role: true, email: true }
      })
      
      if (!user) {
        return reply.status(401).send({
          message: 'Session invalide. Veuillez vous reconnecter.'
        })
      }
      
      request.user = user
    } catch (err) {
      app.log.error('Authentication error:', err)
      return reply.status(401).send({
        message: 'Session invalide. Veuillez vous reconnecter.'
      })
    }
  })

  // Register plugins
  app.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://nexus-gaming.vercel.app'
      ]
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true)
        return
      }
      cb(new Error('Not allowed'), false)
    },
    credentials: true,
  })

  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  })

  // Error handling for serverless environment
  app.setErrorHandler(async (error, request, reply) => {
    app.log.error(error)
    
    if (error.name === 'PrismaClientKnownRequestError') {
      return reply.status(400).send({
        error: 'Database Error',
        message: 'Une erreur est survenue lors de l\'accès aux données'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        error: 'Authentication Error',
        message: 'Session invalide. Veuillez vous reconnecter.'
      })
    }

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Une erreur inattendue est survenue'
    })
  })

  // Cleanup function for serverless environment
  const cleanup = async () => {
    try {
      await prisma.$disconnect()
    } catch (e) {
      console.error('Error during cleanup:', e)
    }
  }

  app.addHook('onClose', cleanup)
  process.on('beforeExit', cleanup)

  return app
}
