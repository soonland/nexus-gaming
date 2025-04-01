import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import { authRoutes } from '../../src/routes/auth'

// Create server instance
const app = createServer()

// Register auth routes without the global prefix
app.register(authRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
