import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      role: 'USER' | 'ADMIN'
      email: string
    }
  }
}
