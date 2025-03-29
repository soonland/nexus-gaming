import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { PrismaClient } from '@prisma/client'

export interface FastifyServerInstance extends FastifyInstance<
  any,
  any,
  any,
  any,
  TypeBoxTypeProvider
> {
  prisma: PrismaClient
  authenticate: any // Add this since we use it in routes
}
