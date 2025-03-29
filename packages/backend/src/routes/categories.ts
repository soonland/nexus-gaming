import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const categoryRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all categories
  fastify.get('/', async () => {
    return await fastify.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  })

  // Create a new category
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 }
          }
        }
      },
    },
    async (request) => {
      const { name } = request.body as { name: string }
      return await fastify.prisma.category.create({
        data: {
          name,
        },
      })
    }
  )

  // Update a category
  fastify.put(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' }
          }
        },
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 }
          }
        }
      },
    },
    async (request) => {
      const { id } = request.params as { id: string }
      const { name } = request.body as { name: string }

      return await fastify.prisma.category.update({
        where: { id },
        data: { name },
      })
    }
  )

  // Delete a category
  fastify.delete(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' }
          }
        }
      },
    },
    async (request) => {
      const { id } = request.params as { id: string }

      // First, update all articles that use this category to have no category
      await fastify.prisma.article.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      })

      // Then delete the category
      return await fastify.prisma.category.delete({
        where: { id },
      })
    }
  )
}

export default categoryRoutes
