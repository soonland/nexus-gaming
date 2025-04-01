import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'

// Schema definitions
export const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
})

export const registerSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  username: Type.String({ minLength: 3 }),
})

// Register handler
export async function registerUser(server: FastifyServerInstance, req: any, res: any) {
  const { email, password, username } = req.body

  // Check if user exists
  const existingUser = await server.prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    return res.status(400).send({
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

  // Generate token with role information
  const token = server.jwt.sign({ 
    id: user.id,
    role: user.role 
  })

  return res.status(201).send({ user, token })
}

// Login handler
export async function loginUser(server: FastifyServerInstance, req: any, res: any) {
  const { email, password } = req.body

  // Find user
  const user = await server.prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return res.status(401).send({
      message: 'Email ou mot de passe incorrect',
    })
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(401).send({
      message: 'Email ou mot de passe incorrect',
    })
  }

  // Generate token with role information
  const token = server.jwt.sign({ 
    id: user.id,
    role: user.role 
  })

  const { password: _, ...userWithoutPassword } = user
  return res.send({ user: userWithoutPassword, token })
}

// Get current user handler
export async function getCurrentUser(server: FastifyServerInstance, req: any, res: any) {
  const user = await server.prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  })

  if (!user) {
    return res.status(404).send({
      message: 'Utilisateur non trouvé',
    })
  }

  return res.send(user)
}
