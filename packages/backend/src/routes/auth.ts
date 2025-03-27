import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { FastifyServerInstance } from '../types/server'
import { AuthenticatedRequest } from '../types/auth'

const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
})

const registerSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  username: Type.String({ minLength: 3 }),
})

export async function authRoutes(server: FastifyServerInstance) {
  // Register
  server.post('/register', {
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
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const { email, password, username } = request.body as any

      // Check if user exists
      const existingUser = await server.prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      })

      if (existingUser) {
        return reply.status(400).send({
          message: 'Email ou nom d\'utilisateur déjà utilisé',
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await server.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      })

      // Generate token
      const token = server.jwt.sign({ id: user.id })

      return reply.send({ user, token })
    },
  })

  // Login
  server.post('/login', {
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
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const { email, password } = request.body as any

      // Find user
      const user = await server.prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(401).send({
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return reply.status(401).send({
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Generate token
      const token = server.jwt.sign({ id: user.id })

      const { password: _, ...userWithoutPassword } = user
      return reply.send({ user: userWithoutPassword, token })
    },
  })

  // Get current user
  server.get('/me', {
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
    async handler(request: AuthenticatedRequest, reply: FastifyReply) {
      const user = await server.prisma.user.findUnique({
        where: { id: request.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      })

      if (!user) {
        return reply.status(404).send({
          message: 'Utilisateur non trouvé',
        })
      }

      return reply.send(user)
    },
  })
}
