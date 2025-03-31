import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import { gameRoutes } from '../../src/routes/games'

// Create server instance
const app = createServer()

// Register game routes without the global prefix
app.register(gameRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
