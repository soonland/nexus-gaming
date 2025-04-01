import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'

// Schema definitions
export const articleSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  gameIds: Type.Array(Type.String()),
  categoryId: Type.Optional(Type.String()),
})

// Helper for checking admin role
function isAdmin(request: any) {
  return request.user?.role === 'ADMIN'
}

// GET handlers
export async function getAllArticles(server: FastifyServerInstance, req: any, res: any) {
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
  return res.send(articles)
}

export async function getArticleById(server: FastifyServerInstance, req: any, res: any) {
  const id = req.params?.id || req.query?.id
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
    return res.status(404).send({ message: 'Article non trouvé' })
  }
  return res.send(article)
}

// POST handler with auth check
export async function createArticle(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || !isAdmin(req)) {
    return res.status(403).send({ 
      message: 'Seuls les administrateurs peuvent créer des articles' 
    })
  }

  const { gameIds, ...articleData } = req.body

  const article = await server.prisma.article.create({
    data: {
      ...articleData,
      userId: req.user.id,
      categoryId: articleData.categoryId || null,
      games: {
        create: gameIds.map((gameId: string) => ({
          game: { connect: { id: gameId } }
        }))
      }
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

  return res.status(201).send(article)
}

// PATCH handler with auth check
export async function updateArticle(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || !isAdmin(req)) {
    return res.status(403).send({ 
      message: 'Seuls les administrateurs peuvent modifier des articles' 
    })
  }

  const id = req.params?.id || req.query?.id
  const { gameIds, ...articleData } = req.body

  const existingArticle = await server.prisma.article.findUnique({
    where: { id }
  })

  if (!existingArticle) {
    return res.status(404).send({ message: 'Article non trouvé' })
  }

  const article = await server.prisma.$transaction(async (prisma) => {
    if (gameIds) {
      await prisma.articleGame.deleteMany({
        where: { articleId: id }
      })
    }

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

  return res.send(article)
}

// DELETE handler with auth check
export async function deleteArticle(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || !isAdmin(req)) {
    return res.status(403).send({ 
      message: 'Seuls les administrateurs peuvent supprimer des articles' 
    })
  }

  const id = req.params?.id || req.query?.id

  const article = await server.prisma.article.findUnique({
    where: { id }
  })

  if (!article) {
    return res.status(404).send({ message: 'Article non trouvé' })
  }

  await server.prisma.article.delete({
    where: { id }
  })

  return res.status(204).send()
}
