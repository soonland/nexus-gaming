import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'

const articleSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  gameIds: Type.Array(Type.String()),
  categoryId: Type.Optional(Type.String()),
})

export async function articleRoutes(server: FastifyServerInstance) {
  // Get all articles
  server.get('/', {
    schema: {
      tags: ['articles'],
      description: 'Liste tous les articles',
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          content: Type.String(),
          publishedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          }),
          games: Type.Array(Type.Object({
            game: Type.Object({
              id: Type.String(),
              title: Type.String(),
              coverImage: Type.Optional(Type.String())
            })
          }))
        }))
      }
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const articles = await server.prisma.article.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          category: true,
          games: {
            include: {
              game: {
                select: {
                  id: true,
                  title: true,
                  coverImage: true,
                },
              },
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      })

      return reply.send(articles)
    },
  })

  // Get article by ID
  server.get('/:id', {
    schema: {
      tags: ['articles'],
      description: 'Obtenir les détails d\'un article spécifique',
      params: Type.Object({
        id: Type.String({ description: 'ID de l\'article' })
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          content: Type.String(),
          publishedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          }),
          games: Type.Array(Type.Object({
            game: Type.Object({
              id: Type.String(),
              title: Type.String(),
              description: Type.String(),
              coverImage: Type.Optional(Type.String())
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

      const article = await server.prisma.article.findUnique({
        where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        games: {
          include: {
            game: true,
          },
        },
      },
    })

    if (!article) {
      return reply.status(404).send({
        message: 'Article non trouvé',
      })
    }

    return reply.send(article)
  },
})

  // Create article - Admin only
  server.post('/', {
    onRequest: [server.authenticate, async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Seuls les administrateurs peuvent créer des articles' })
      }
    }],
    schema: {
      tags: ['articles'],
      description: 'Créer un nouvel article',
      security: [{ bearerAuth: [] }],
      body: articleSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          content: Type.String(),
          publishedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          }),
          games: Type.Array(Type.Object({
            game: Type.Object({
              id: Type.String(),
              title: Type.String()
            })
          }))
        }),
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: async (request: AuthenticatedRequest, reply: FastifyReply) => {
      const userId = request.user.id
      const { gameIds, ...articleData } = request.body as any

      const article = await server.prisma.article.create({
        data: {
          ...articleData,
          userId,
          categoryId: articleData.categoryId || null,
          games: {
            create: gameIds.map((gameId: string) => ({
              game: {
                connect: {
                  id: gameId,
                },
              },
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          games: {
            include: {
              game: true,
            },
          },
        },
      })

      return reply.status(201).send(article)
    }
  })

  // Update article - Admin only
  server.patch('/:id', {
    onRequest: [server.authenticate, async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Seuls les administrateurs peuvent modifier des articles' })
      }
    }],
    schema: {
      tags: ['articles'],
      description: 'Modifier un article existant',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de l\'article' })
      }),
      body: Type.Partial(articleSchema),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          content: Type.String(),
          publishedAt: Type.String(),
          user: Type.Object({
            id: Type.String(),
            username: Type.String()
          }),
          games: Type.Array(Type.Object({
            game: Type.Object({
              id: Type.String(),
              title: Type.String()
            })
          }))
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
      const { gameIds, ...articleData } = request.body as any

      // Check if article exists and belongs to user
      const existingArticle = await server.prisma.article.findUnique({
        where: { id },
      })

      if (!existingArticle) {
        return reply.status(404).send({
          message: 'Article non trouvé',
        })
      }

      if (existingArticle.userId !== userId && request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      // Update article with transaction to handle games relationship
      const article = await server.prisma.$transaction(async (prisma) => {
        // Remove existing game connections
        if (gameIds) {
          await prisma.articleGame.deleteMany({
            where: {
              articleId: id,
            },
          })
        }

        // Update article and create new game connections
        return prisma.article.update({
          where: { id },
          data: {
            ...articleData,
            categoryId: articleData.categoryId ?? undefined,
            ...(gameIds && {
              games: {
                create: gameIds.map((gameId: string) => ({
                  game: {
                    connect: {
                      id: gameId,
                    },
                  },
                })),
              },
            }),
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            games: {
              include: {
                game: true,
              },
            },
          },
        })
      })

      return reply.send(article)
    }
  })

  // Delete article - Admin only
  server.delete('/:id', {
    onRequest: [server.authenticate, async (request: AuthenticatedRequest, reply: FastifyReply) => {
      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Seuls les administrateurs peuvent supprimer des articles' })
      }
    }],
    schema: {
      tags: ['articles'],
      description: 'Supprimer un article',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        id: Type.String({ description: 'ID de l\'article' })
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

      // Check if article exists and belongs to user
      const article = await server.prisma.article.findUnique({
        where: { id },
      })

      if (!article) {
        return reply.status(404).send({
          message: 'Article non trouvé',
        })
      }

      if (article.userId !== userId && request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          message: 'Action non autorisée',
        })
      }

      await server.prisma.article.delete({
        where: { id },
      })

      return reply.status(204).send()
    }
  })
}
