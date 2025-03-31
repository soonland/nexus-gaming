import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'
import { Game, Prisma } from '@prisma/client'

type GameWithRelations = Game & {
  platforms: {
    id: string
    name: string
    manufacturer: string
    releaseDate: string | null
    createdAt: Date
    updatedAt: Date
  }[]
  developer: {
    id: string
    name: string
  }
  publisher: {
    id: string
    name: string
  }
  reviews?: {
    rating: number
  }[]
}

const gameSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  releaseDate: Type.Optional(Type.String()),
  platformIds: Type.Array(Type.String()),
  publisherId: Type.String(),
  developerId: Type.String(),
  coverImage: Type.Optional(Type.String()),
})

const formatDates = (game: GameWithRelations) => ({
  ...game,
  createdAt: game.createdAt.toISOString(),
  updatedAt: game.updatedAt.toISOString(),
})

export async function gameRoutes(server: FastifyServerInstance) {
  // Get all games
  server.get('/games', {
    schema: {
      tags: ['games'],
      description: 'Liste tous les jeux avec leur note moyenne',
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          platforms: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            manufacturer: Type.String(),
            releaseDate: Type.Union([Type.String(), Type.Null()])
          })),
          developer: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          publisher: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          coverImage: Type.Optional(Type.String()),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          averageRating: Type.Union([Type.Number(), Type.Null()])
        }))
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const games = await server.prisma.game.findMany({
        include: {
          platforms: true,
          developer: true,
          publisher: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }) as GameWithRelations[]

      const gamesWithRating = games.map((game) => {
        const ratings = game.reviews?.map(review => review.rating) || []
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null

        const { reviews, ...gameWithoutReviews } = game
        
        return {
          ...formatDates(gameWithoutReviews),
          platforms: game.platforms.map(platform => ({
            ...platform,
            releaseDate: platform.releaseDate
          })),
          averageRating,
        }
      })

      return reply.send(gamesWithRating)
    }
  })

  // Get game by ID
  server.get('/games/:id', {
    schema: {
      tags: ['games'],
      description: 'Obtenir les détails d\'un jeu spécifique',
      params: Type.Object({
        id: Type.String({ description: 'ID du jeu' })
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          platforms: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            manufacturer: Type.String(),
            releaseDate: Type.Union([Type.String(), Type.Null()])
          })),
          developer: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          publisher: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          coverImage: Type.Optional(Type.String()),
          createdAt: Type.String(),
          updatedAt: Type.String(),
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string }

      const game = await server.prisma.game.findUnique({
        where: { id },
        include: {
          platforms: true,
          developer: true,
          publisher: true,
        },
      }) as GameWithRelations | null

      if (!game) {
        return reply.status(404).send({ message: 'Jeu non trouvé' })
      }

      return reply.send({
        ...formatDates(game),
        platforms: game.platforms.map(platform => ({
          ...platform,
          releaseDate: platform.releaseDate
        }))
      })
    }
  })

  // Create game (admin only)
  server.post('/games', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['games'],
      description: 'Créer un nouveau jeu (admin uniquement)',
      security: [{ bearerAuth: [] }],
      body: gameSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          platforms: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            manufacturer: Type.String(),
            releaseDate: Type.Union([Type.String(), Type.Null()])
          })),
          developer: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          publisher: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          coverImage: Type.Optional(Type.String()),
          createdAt: Type.String(),
          updatedAt: Type.String()
        }),
        403: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      const { platformIds, developerId, publisherId, ...rest } = request.body as any

      const game = await server.prisma.game.create({
        data: {
          ...rest,
          developer: {
            connect: { id: developerId }
          },
          publisher: {
            connect: { id: publisherId }
          },
          platforms: {
            connect: platformIds.map((id: string) => ({ id }))
          }
        },
        include: {
          platforms: true,
          developer: true,
          publisher: true,
        }
      }) as GameWithRelations

      return reply.status(201).send({
        ...formatDates(game),
        platforms: game.platforms.map(platform => ({
          ...platform,
          releaseDate: platform.releaseDate
        }))
      })
    }
  })

  // Update game (admin only)
  server.patch('/games/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['games'],
      description: 'Mettre à jour un jeu existant (admin uniquement)',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID du jeu' })
      }),
      body: Type.Partial(gameSchema),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          releaseDate: Type.Union([Type.String(), Type.Null()]),
          platforms: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            manufacturer: Type.String(),
            releaseDate: Type.Union([Type.String(), Type.Null()])
          })),
          developer: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          publisher: Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
          coverImage: Type.Optional(Type.String()),
          createdAt: Type.String(),
          updatedAt: Type.String()
        }),
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
          message: 'Action non autorisée',
        })
      }

      const { id } = request.params as { id: string }
      const { platformIds, developerId, publisherId, ...rest } = request.body as any

      try {
        const game = await server.prisma.game.update({
          where: { id },
          data: {
            ...rest,
            ...(developerId && {
              developer: {
                connect: { id: developerId }
              }
            }),
            ...(publisherId && {
              publisher: {
                connect: { id: publisherId }
              }
            }),
            ...(platformIds && {
              platforms: {
                set: platformIds.map((id: string) => ({ id }))
              }
            })
          },
          include: {
            platforms: true,
            developer: true,
            publisher: true,
          }
        }) as GameWithRelations

        return reply.send({
          ...formatDates(game),
          platforms: game.platforms.map(platform => ({
            ...platform,
            releaseDate: platform.releaseDate
          }))
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          return reply.status(404).send({ message: 'Jeu non trouvé' })
        }
        throw error
      }
    }
  })

  // Delete game (admin only)
  server.delete('/games/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['games'],
      description: 'Supprimer un jeu (admin uniquement)',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID du jeu' })
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
          message: 'Action non autorisée',
        })
      }

      const { id } = request.params as { id: string }

      try {
        await server.prisma.game.delete({
          where: { id },
        })
        return reply.status(204).send()
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          return reply.status(404).send({ message: 'Jeu non trouvé' })
        }
        throw error
      }
    }
  })
}
