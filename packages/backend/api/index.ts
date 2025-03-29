import { createServer } from '../src'
import { FastifyRequest, FastifyReply } from 'fastify'

let app: Awaited<ReturnType<typeof createServer>>

async function handler(req: FastifyRequest['raw'], res: FastifyReply['raw']) {
  try {
    if (!app) {
      app = await createServer()
      await app.ready()
    }

    app.server.emit('request', req, res)
  } catch (error: any) {
    console.error('Serverless handler error:', error)
    res.statusCode = 500
    res.end(JSON.stringify({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined 
    }))
  }
}

export default handler
