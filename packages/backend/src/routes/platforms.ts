import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'
import {
  platformSchema,
  getAllPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform
} from '../handlers/platforms'

export async function platformRoutes(server: FastifyServerInstance) {
  // Get all platforms
  server.get('/api/platforms', {
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
    handler: (request, reply) => getAllPlatforms(server, request, reply)
  })

  // Get platform by ID
  server.get('/api/platforms/:id', {
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
    handler: (request, reply) => getPlatformById(server, request, reply)
  })

  // Create platform (admin only)
  server.post('/api/platforms', {
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
    handler: (request, reply) => createPlatform(server, request, reply)
  })

  // Update platform (admin only)
  server.patch('/api/platforms/:id', {
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
    handler: (request, reply) => updatePlatform(server, request, reply)
  })

  // Delete platform (admin only)
  server.delete('/api/platforms/:id', {
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
    handler: (request, reply) => deletePlatform(server, request, reply)
  })
}
