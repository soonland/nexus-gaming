import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'

const reviewSchema = Type.Object({
  rating: Type.Number({
    minimum: 0,
    maximum: 5,
  }),
  content: Type.String({
    minLength: 10,
  }),
  gameId: Type.String(),
})

export async function reviewRoutes(server: FastifyServerInstance) {
  // Get reviews for a game
  server.get('/game/:gameId', {
    schema: {
      tags: ['reviews'],
      description: 'Obtenir toutes les critiques pour un jeu spécifique',
      params: Type.Object({
        gameId: Type.String({ description: 'ID du jeu' })
      }),
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          rating: Type.Number(),
          content: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          })
        }))
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { gameId } = request.params as { gameId: string }

      const reviews = await server.prisma.review.findMany({
      where: { gameId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return reply.send(reviews)
  },
})

  // Create review
  server.post('/', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['reviews'],
      description: 'Publier une critique pour un jeu',
      security: [{ bearerAuth: [] }],
      body: reviewSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          rating: Type.Number(),
          content: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          })
        }),
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      const userId = request.user.id
      const reviewData = request.body as any

      // Check if user has already reviewed this game
      const existingReview = await server.prisma.review.findFirst({
        where: {
          userId,
          gameId: reviewData.gameId,
        },
      })

      if (existingReview) {
        return reply.status(400).send({
          message: 'Vous avez déjà publié une critique pour ce jeu',
        })
      }

      const review = await server.prisma.review.create({
        data: {
          ...reviewData,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      })

      return reply.status(201).send(review)
    }
  })

  // Update review
  server.patch('/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['reviews'],
      description: 'Modifier une critique existante',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de la critique' })
      }),
      body: Type.Partial(reviewSchema),
      response: {
        200: Type.Object({
          id: Type.String(),
          rating: Type.Number(),
          content: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          })
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
      const { id } = request.params as { id: string }
      const userId = request.user.id
      const reviewData = request.body as any

      // Check if review exists and belongs to user
      const existingReview = await server.prisma.review.findUnique({
        where: { id },
      })

      if (!existingReview) {
        return reply.status(404).send({
          message: 'Critique non trouvée',
        })
      }

      if (existingReview.userId !== userId) {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      const review = await server.prisma.review.update({
        where: { id },
        data: reviewData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      })

      return reply.send(review)
    }
  })

  // Delete review
  server.delete('/:id', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['reviews'],
      description: 'Supprimer une critique',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de la critique' })
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
      const { id } = request.params as { id: string }
      const userId = request.user.id

      // Check if review exists and belongs to user
      const review = await server.prisma.review.findUnique({
        where: { id },
      })

      if (!review) {
        return reply.status(404).send({
          message: 'Critique non trouvée',
        })
      }

      if (review.userId !== userId && request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      await server.prisma.review.delete({
        where: { id },
      })

      return reply.status(204).send()
    }
  })
}
