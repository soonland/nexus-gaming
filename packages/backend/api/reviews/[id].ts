import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import { reviewRoutes } from '../../src/routes/reviews'

// Create server instance
const app = createServer()

// Register review routes without the global prefix
app.register(reviewRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
