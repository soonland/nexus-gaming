import { Type } from '@sinclair/typebox'
import { FastifyServerInstance } from '../types/server'
import { 
  articleSchema,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} from '../handlers/articles'

export async function articleRoutes(server: FastifyServerInstance) {
  // Get all articles
  server.get('/api/articles', {
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
    handler: (request, reply) => getAllArticles(server, request, reply)
  })

  // Get article by ID
  server.get('/api/articles/:id', {
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
    handler: (request, reply) => getArticleById(server, request, reply)
  })

  // Create article - Admin only
  server.post('/api/articles/', {
    onRequest: [server.authenticate],
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
    handler: (request, reply) => createArticle(server, request, reply)
  })

  // Update article - Admin only
  server.patch('/api/articles/:id', {
    onRequest: [server.authenticate],
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
    handler: (request, reply) => updateArticle(server, request, reply)
  })

  // Delete article - Admin only
  server.delete('/api/articles/:id', {
    onRequest: [server.authenticate],
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
    handler: (request, reply) => deleteArticle(server, request, reply)
  })
}
