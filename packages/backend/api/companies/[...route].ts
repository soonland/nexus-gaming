import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'
import companyRoutes from '../../src/routes/companies'

// Create server instance
const app = createServer()

// Register company routes without the global prefix
app.register(companyRoutes)

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
