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
    releaseDate: Date | null
    createdAt: Date
    updatedAt: Date
  }[]
  reviews?: {
    rating: number
  }[]
}

const gameSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  releasePeriod: Type.Optional(Type.Object({
    type: Type.Union([
      Type.Literal('date'),
      Type.Literal('quarter'),
      Type.Literal('month')
    ]),
    value: Type.String()
  })),
  platformIds: Type.Array(Type.String()),
  publisher: Type.String(),
  developer: Type.String(),
  coverImage: Type.Optional(Type.String()),
})

const formatGameDates = (game: GameWithRelations) => ({
  ...game,
  releaseDate: game.releaseDate ? game.releaseDate.toISOString().split('T')[0] : null,
  createdAt: game.createdAt.toISOString(),
  updatedAt: game.updatedAt.toISOString(),
})

const parseReleasePeriod = (releasePeriod: any) => {
  if (!releasePeriod) return null;

  switch (releasePeriod.type) {
    case 'date':
      return new Date(`${releasePeriod.value}T00:00:00Z`);
    case 'month':
      return new Date(`${releasePeriod.value}-01T00:00:00Z`);
    case 'quarter':
      const [year, quarter] = releasePeriod.value.split('-Q');
      const month = ((parseInt(quarter) - 1) * 3 + 1).toString().padStart(2, '0');
      return new Date(`${year}-${month}-01T00:00:00Z`);
    default:
      return null;
  }
}

export async function gameRoutes(server: FastifyServerInstance) {
  // Get all games
  server.get('/', {
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
          publisher: Type.String(),
          developer: Type.String(),
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
          ...formatGameDates(gameWithoutReviews),
          platforms: game.platforms.map(platform => ({
            ...platform,
            releaseDate: platform.releaseDate ? platform.releaseDate.toISOString().split('T')[0] : null
          })),
          averageRating,
        }
      })

      return reply.send(gamesWithRating)
    }
  })

  // Get game by ID
  server.get('/:id', {
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
          publisher: Type.String(),
          developer: Type.String(),
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
          platforms: true
        },
      }) as GameWithRelations | null

      if (!game) {
        return reply.status(404).send({ message: 'Jeu non trouvé' })
      }

      return reply.send({
        ...formatGameDates(game),
        platforms: game.platforms.map(platform => ({
          ...platform,
          releaseDate: platform.releaseDate ? platform.releaseDate.toISOString().split('T')[0] : null
        }))
      })
    }
  })

  // Create game (admin only)
  server.post('/', {
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
          publisher: Type.String(),
          developer: Type.String(),
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

      const { releasePeriod, platformIds, ...rest } = request.body as any
      const releaseDate = parseReleasePeriod(releasePeriod)

      const game = await server.prisma.game.create({
        data: {
          ...rest,
          releaseDate,
          platforms: {
            connect: platformIds.map((id: string) => ({ id }))
          }
        },
        include: {
          platforms: true
        }
      }) as GameWithRelations

      return reply.status(201).send({
        ...formatGameDates(game),
        platforms: game.platforms.map(platform => ({
          ...platform,
          releaseDate: platform.releaseDate ? platform.releaseDate.toISOString().split('T')[0] : null
        }))
      })
    }
  })

  // Update game (admin only)
  server.patch('/:id', {
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
          publisher: Type.String(),
          developer: Type.String(),
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
      const { releasePeriod, platformIds, ...rest } = request.body as any
      const releaseDate = releasePeriod ? parseReleasePeriod(releasePeriod) : undefined

      try {
        const game = await server.prisma.game.update({
          where: { id },
          data: {
            ...rest,
            ...(releaseDate !== undefined && { releaseDate }),
            ...(platformIds && {
              platforms: {
                set: platformIds.map((id: string) => ({ id }))
              }
            })
          },
          include: {
            platforms: true
          }
        }) as GameWithRelations

        return reply.send({
          ...formatGameDates(game),
          platforms: game.platforms.map(platform => ({
            ...platform,
            releaseDate: platform.releaseDate ? platform.releaseDate.toISOString().split('T')[0] : null
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
  server.delete('/:id', {
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
