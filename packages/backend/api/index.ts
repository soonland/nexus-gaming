import { createServer } from '../src'
import { FastifyRequest, FastifyReply } from 'fastify'

let app: Awaited<ReturnType<typeof createServer>>

async function handler(req: FastifyRequest['raw'], res: FastifyReply['raw']) {
  if (!app) {
    app = await createServer()
    // Nécessaire pour Vercel
    await app.ready()
  }

  // Adaptation pour le format serverless
  const prefix = '/api'
  if (req.url && req.url.startsWith(prefix)) {
    req.url = req.url.replace(prefix, '')
  }

  app.server.emit('request', req, res)
}

export default handler
