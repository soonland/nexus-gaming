import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'
import { Platform, Prisma } from '@prisma/client'

const platformSchema = Type.Object({
  name: Type.String(),
  manufacturer: Type.String(),
  releaseDate: Type.Optional(Type.String({ 
    pattern: '^(\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])|\d{4}-(0[1-9]|1[0-2])|\d{4}-Q[1-4])$',
    description: 'Format: YYYY-MM-DD pour une date précise, YYYY-MM pour un mois, YYYY-QN pour un trimestre'
  }))
})

interface PlatformWithGames extends Platform {
  games?: {
    id: string
    title: string
  }[]
}

const formatPlatformDates = (platform: Platform) => ({
  ...platform,
  createdAt: platform.createdAt.toISOString(),
  updatedAt: platform.updatedAt.toISOString()
})

export async function platformRoutes(server: FastifyServerInstance) {
  // Get all platforms
  server.get('/', {
    schema: {
      tags: ['platforms'],
      description: 'Liste toutes les plateformes',
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String(),
          manufacturer: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          createdAt: Type.String(),
          updatedAt: Type.String()
        }))
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const platforms = await server.prisma.platform.findMany({
        orderBy: { name: 'asc' }
      })
      return reply.send(platforms.map(formatPlatformDates))
    }
  })

  // Get platform by ID
  server.get('/:id', {
    schema: {
      tags: ['platforms'],
      description: 'Obtenir les détails d\'une plateforme spécifique',
      params: Type.Object({
        id: Type.String({ description: 'ID de la plateforme' })
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          manufacturer: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          games: Type.Optional(Type.Array(Type.Object({
            id: Type.String(),
            title: Type.String()
          })))
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string }

      const platform = await server.prisma.platform.findUnique({
        where: { id },
        include: {
          games: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }) as PlatformWithGames | null

      if (!platform) {
        return reply.status(404).send({ message: 'Plateforme non trouvée' })
      }

      return reply.send(formatPlatformDates(platform))
    }
  })

  // Create platform (admin only)
  server.post('/', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['platforms'],
      description: 'Créer une nouvelle plateforme (admin uniquement)',
      security: [{ bearerAuth: [] }],
      body: platformSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          name: Type.String(),
          manufacturer: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          createdAt: Type.String(),
          updatedAt: Type.String()
        }),
        403: Type.Object({
          message: Type.String()
        }),
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée'
        })
      }

      const platformData = request.body as {
        name: string
        manufacturer: string
        releaseDate?: string
      }

      try {
        const platform = await server.prisma.platform.create({
          data: {
            name: platformData.name,
            manufacturer: platformData.manufacturer,
            releaseDate: platformData.releaseDate
          }
        })

        return reply.status(201).send(formatPlatformDates(platform))
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return reply.status(400).send({ message: 'Le nom de la plateforme doit être unique' })
          }
        }
        throw error
      }
    }
  })

  // Update platform (admin only)
  server.patch('/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['platforms'],
      description: 'Mettre à jour une plateforme existante (admin uniquement)',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de la plateforme' })
      }),
      body: Type.Partial(platformSchema),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          manufacturer: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          createdAt: Type.String(),
          updatedAt: Type.String()
        }),
        403: Type.Object({
          message: Type.String()
        }),
        404: Type.Object({
          message: Type.String()
        }),
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée'
        })
      }

      const { id } = request.params as { id: string }
      const platformData = request.body as Partial<{
        name: string
        manufacturer: string
        releaseDate?: string
      }>

      try {
        const platform = await server.prisma.platform.update({
          where: { id },
          data: {
            ...platformData,
            releaseDate: platformData.releaseDate
          }
        })

        return reply.send(formatPlatformDates(platform))
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return reply.status(404).send({ message: 'Plateforme non trouvée' })
          }
          if (error.code === 'P2002') {
            return reply.status(400).send({ message: 'Le nom de la plateforme doit être unique' })
          }
        }
        throw error
      }
    }
  })

  // Delete platform (admin only)
  server.delete('/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['platforms'],
      description: 'Supprimer une plateforme (admin uniquement)',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de la plateforme' })
      }),
      response: {
        204: Type.Null(),
        403: Type.Object({
          message: Type.String()
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée'
        })
      }

      const { id } = request.params as { id: string }

      try {
        await server.prisma.platform.delete({
          where: { id }
        })
        return reply.status(204).send()
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          return reply.status(404).send({ message: 'Plateforme non trouvée' })
        }
        throw error
      }
    }
  })
}
