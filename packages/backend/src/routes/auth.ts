import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'
import {
  loginSchema,
  registerSchema,
  registerUser,
  loginUser,
  getCurrentUser
} from '../handlers/auth'

export async function authRoutes(server: FastifyServerInstance) {
  // Register
  server.post('/api/auth/register', {
    schema: {
      tags: ['auth'],
      description: 'Créer un nouveau compte utilisateur',
      body: registerSchema,
      response: {
        201: Type.Object({
          user: Type.Object({
            id: Type.String(),
            email: Type.String(),
            username: Type.String(),
            role: Type.String()
          }),
          token: Type.String()
        }),
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: (request, reply) => registerUser(server, request, reply)
  })

  // Login
  server.post('/api/auth/login', {
    schema: {
      tags: ['auth'],
      description: 'Se connecter à un compte existant',
      body: loginSchema,
      response: {
        200: Type.Object({
          user: Type.Object({
            id: Type.String(),
            email: Type.String(),
            username: Type.String(),
            role: Type.String()
          }),
          token: Type.String()
        }),
        401: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: (request, reply) => loginUser(server, request, reply)
  })

  // Get current user
  server.get('/api/auth/me', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['auth'],
      description: 'Obtenir les informations de l\'utilisateur connecté',
      security: [{ bearerAuth: [] }],
      response: {
        200: Type.Object({
          id: Type.String(),
          email: Type.String(),
          username: Type.String(),
          role: Type.String()
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    },
    handler: (request, reply) => getCurrentUser(server, request, reply)
  })
}
