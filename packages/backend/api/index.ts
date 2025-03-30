import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { prisma } from '../src/plugins/prisma'
import { configureRoutes } from '../src/routes'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { FastifyServerInstance } from '../src/types/server'

const app: FastifyServerInstance = fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

// Plugins
app.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://nexus-gaming-frontend.vercel.app'
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

app.register(swagger, {
  swagger: {
    info: {
      title: 'Nexus Gaming API',
      description: 'API pour gérer les jeux vidéo, critiques et articles',
      version: '1.0.0'
    },
    tags: [
      { name: 'auth', description: 'Authentification et gestion des utilisateurs' },
      { name: 'games', description: 'Gestion des jeux vidéo' },
      { name: 'articles', description: 'Gestion des articles' },
      { name: 'reviews', description: 'Gestion des critiques' },
      { name: 'platforms', description: 'Gestion des plateformes de jeu' }
    ]
  }
})

app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }
})

// Add JWT verification decorator
app.decorate('authenticate', async function(request: any, reply: any) {
  try {
    await request.jwtVerify()
    const user = await app.prisma.user.findUnique({
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

// Register custom plugins
app.register(prisma)

// Add health check route
app.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
configureRoutes(app)

export default async function handler(req: any, reply: any) {
  try {
    await app.ready()
    return app.server.emit('request', req, reply)
  } catch (error: any) {
    console.error('Serverless handler error:', error)
    reply.statusCode = 500
    reply.end(JSON.stringify({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined 
    }))
  }
}
