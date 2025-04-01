import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'
import { 
  categorySchema,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../handlers/categories'

export async function categoryRoutes(server: FastifyServerInstance) {
  // Get all categories
  server.get('/api/categories', {
    schema: {
      tags: ['categories'],
      description: 'Liste toutes les catégories',
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String()
        }))
      }
    },
    handler: (request, reply) => getAllCategories(server, request, reply)
  })

  // Create a new category
  server.post('/api/categories', {
    schema: {
      tags: ['categories'],
      description: 'Créer une nouvelle catégorie',
      body: categorySchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          name: Type.String()
        })
      }
    },
    handler: (request, reply) => createCategory(server, request, reply)
  })

  // Update a category
  server.put('/api/categories/:id', {
    schema: {
      tags: ['categories'],
      description: 'Modifier une catégorie existante',
      params: Type.Object({
        id: Type.String({ format: 'uuid' })
      }),
      body: categorySchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String()
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: (request, reply) => updateCategory(server, request, reply)
  })

  // Delete a category
  server.delete('/api/categories/:id', {
    schema: {
      tags: ['categories'],
      description: 'Supprimer une catégorie',
      params: Type.Object({
        id: Type.String({ format: 'uuid' })
      }),
      response: {
        204: Type.Null(),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: (request, reply) => deleteCategory(server, request, reply)
  })
}
