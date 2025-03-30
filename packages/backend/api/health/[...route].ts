import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from '../server'

// Create server instance
const app = createServer()

// Add health check route
app.get('/', async () => {
  return { status: 'ok' }
})

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
