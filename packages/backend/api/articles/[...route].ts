import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import { articleRoutes } from '../../src/routes/articles'

// Create server instance
const app = createServer()

// Register article routes without the global prefix
app.register(articleRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
