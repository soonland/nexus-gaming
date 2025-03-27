import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const prisma = fp(async (server) => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

  await prisma.$connect()

  // Make Prisma Client available through the fastify server instance
  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})
