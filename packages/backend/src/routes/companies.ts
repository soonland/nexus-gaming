import { FastifyPluginAsync } from 'fastify'
import { Static, Type } from '@sinclair/typebox'

const Company = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isDeveloper: Type.Boolean(),
  isPublisher: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String()
})

const CompanyInput = Type.Object({
  name: Type.String(),
  isDeveloper: Type.Boolean(),
  isPublisher: Type.Boolean()
})

type CompanyInput = Static<typeof CompanyInput>

const companies: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', {
    schema: {
      response: {
        200: Type.Array(Company)
      }
    },
    handler: async (request, reply) => {
      return fastify.prisma.company.findMany({
        orderBy: { name: 'asc' }
      })
    }
  })

  fastify.get('/developers', {
    schema: {
      response: {
        200: Type.Array(Company)
      }
    },
    handler: async (request, reply) => {
      return fastify.prisma.company.findMany({
        where: { isDeveloper: true },
        orderBy: { name: 'asc' }
      })
    }
  })

  fastify.get('/publishers', {
    schema: {
      response: {
        200: Type.Array(Company)
      }
    },
    handler: async (request, reply) => {
      return fastify.prisma.company.findMany({
        where: { isPublisher: true },
        orderBy: { name: 'asc' }
      })
    }
  })

  fastify.get('/:id', {
    schema: {
      response: {
        200: Company
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const company = await fastify.prisma.company.findUnique({
        where: { id }
      })
      return company
    }
  })

  fastify.post('/', {
    schema: {
      body: CompanyInput,
      response: {
        201: Company
      }
    },
    handler: async (request, reply) => {
      const data = request.body as CompanyInput
      const company = await fastify.prisma.company.create({
        data
      })
      reply.status(201)
      return company
    }
  })

  fastify.put('/:id', {
    schema: {
      body: CompanyInput,
      response: {
        200: Company
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = request.body as CompanyInput
      return fastify.prisma.company.update({
        where: { id },
        data
      })
    }
  })

  fastify.delete('/:id', {
    schema: {
      response: {
        200: Company
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      return fastify.prisma.company.delete({
        where: { id }
      })
    }
  })
}

export default companies
