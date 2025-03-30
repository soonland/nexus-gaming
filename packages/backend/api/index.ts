import { createServer } from '../src'
import { FastifyRequest, FastifyReply } from 'fastify'
import { FastifyServerInstance } from '../src/types/server'

let app: FastifyServerInstance | null = null

export default async function handler(req: FastifyRequest['raw'], reply: FastifyReply['raw']) {
  try {
    if (!app) {
      app = await createServer()
    }
    await app.ready()
    return app.server.emit('request', req, reply)
  } catch (error: any) {
    console.error('Serverless handler error:', error)
    reply.statusCode = 500
    reply.end(JSON.stringify({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined 
    }))
  }
}
