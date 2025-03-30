import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import categoryRoutes from '../../src/routes/categories'

// Create server instance
const app = createServer()

// Register category routes without the global prefix
app.register(categoryRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
