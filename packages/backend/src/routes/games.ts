import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'

const gameSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  releaseDate: Type.String({ format: 'date' }),
  platform: Type.Array(Type.String()),
  publisher: Type.String(),
  developer: Type.String(),
  coverImage: Type.Optional(Type.String()),
})

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
          releaseDate: Type.String(),
          platform: Type.Array(Type.String()),
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
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    // Calculate average rating for each game
    const gamesWithRating = games.map((game) => {
      const ratings = game.reviews.map((review) => review.rating)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null

      const { reviews, ...gameWithoutReviews } = game
      return {
        ...gameWithoutReviews,
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
      description: 'Obtenir les détails d\'un jeu spécifique avec ses critiques et articles',
      params: Type.Object({
        id: Type.String({ description: 'ID du jeu' })
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          releaseDate: Type.String(),
          platform: Type.Array(Type.String()),
          publisher: Type.String(),
          developer: Type.String(),
          coverImage: Type.Optional(Type.String()),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          reviews: Type.Array(Type.Object({
            id: Type.String(),
            rating: Type.Number(),
            content: Type.String(),
            user: Type.Object({
              id: Type.String(),
              username: Type.String()
            })
          })),
          articles: Type.Array(Type.Object({
            article: Type.Object({
              id: Type.String(),
              title: Type.String(),
              publishedAt: Type.String(),
              user: Type.Object({
                username: Type.String()
              })
            })
          }))
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        articles: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                publishedAt: true,
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!game) {
      return reply.status(404).send({
        message: 'Jeu non trouvé',
      })
    }

      return reply.send(game)
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
          releaseDate: Type.String(),
          platform: Type.Array(Type.String()),
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
      // Check if user is admin
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      const gameData = request.body as any

      const game = await server.prisma.game.create({
        data: gameData,
      })

      return reply.status(201).send(game)
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
          releaseDate: Type.String(),
          platform: Type.Array(Type.String()),
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
      // Check if user is admin
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      const { id } = request.params as { id: string }
      const gameData = request.body as any

      const game = await server.prisma.game.update({
        where: { id },
        data: gameData,
      })

      return reply.send(game)
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
      // Check if user is admin
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      const { id } = request.params as { id: string }

      await server.prisma.game.delete({
        where: { id },
      })

      return reply.status(204).send()
    }
  })
}
