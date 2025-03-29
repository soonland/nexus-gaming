import fastify, { FastifyBaseLogger, RawServerDefault } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { FastifyServerInstance } from './types/server'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { FastifySwaggerOptions } from '@fastify/swagger'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { prisma } from './plugins/prisma'
import { configureRoutes } from './routes'

const server: FastifyServerInstance = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>()

// Add JWT verification decorator
server.decorate('authenticate', async function(request: any, reply: any) {
  try {
    await request.jwtVerify()
    // Fetch user with role after token verification
    const user = await server.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, role: true, email: true }
    })
    
    if (!user) {
      return reply.status(401).send({
        message: 'Session invalide. Veuillez vous reconnecter.'
      })
    }
    
    // Update request.user with role information
    request.user = user
  } catch (err) {
    server.log.error('Authentication error:', err)
    return reply.status(401).send({
      message: 'Session invalide. Veuillez vous reconnecter.'
    })
  }
})

async function main() {
  try {
    // Plugins
    await server.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    })

    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    })

    // Configure Swagger Documentation
    // Register Swagger
    await server.register(swagger, {
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
        ],
        securityDefinitions: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
          }
        }
      }
    })

    // Register custom plugins first
    await server.register(prisma)

    // Register Swagger UI
    await server.register(swaggerUi, {
      routePrefix: '/',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true
      }
    })

    // Register routes after plugins
    await configureRoutes(server)

    // Start server
    await server.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server running at http://localhost:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
