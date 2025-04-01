import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import { platformRoutes } from '../../src/routes/platforms'

// Create server instance
const app = createServer()

// Register platform routes without the global prefix
app.register(platformRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
