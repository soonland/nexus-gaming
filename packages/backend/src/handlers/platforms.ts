import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'
import { Platform, Prisma } from '@prisma/client'

// Helper function
const formatPlatformDates = (platform: Platform) => ({
  ...platform,
  createdAt: platform.createdAt.toISOString(),
  updatedAt: platform.updatedAt.toISOString()
})

// Schema definitions
export const platformSchema = Type.Object({
  name: Type.String(),
  manufacturer: Type.String(),
  releaseDate: Type.Optional(Type.String())
})

// GET handlers
export async function getAllPlatforms(server: FastifyServerInstance, req: any, res: any) {
  const platforms = await server.prisma.platform.findMany({
    orderBy: { name: 'asc' }
  })
  return res.send(platforms.map(formatPlatformDates))
}

export async function getPlatformById(server: FastifyServerInstance, req: any, res: any) {
  const id = req.params?.id || req.query?.id
  const platform = await server.prisma.platform.findUnique({
    where: { id },
    include: {
      games: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  if (!platform) {
    return res.status(404).send({ message: 'Plateforme non trouvée' })
  }

  return res.send(formatPlatformDates(platform))
}

// POST handler with admin check
export async function createPlatform(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).send({ message: 'Action non autorisée' })
  }

  try {
    const platform = await server.prisma.platform.create({
      data: {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        releaseDate: req.body.releaseDate
      }
    })
    return res.status(201).send(formatPlatformDates(platform))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).send({ message: 'Le nom de la plateforme doit être unique' })
    }
    throw error
  }
}

// PATCH handler with admin check
export async function updatePlatform(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).send({ message: 'Action non autorisée' })
  }

  const id = req.params?.id || req.query?.id
  try {
    const platform = await server.prisma.platform.update({
      where: { id },
      data: {
        ...req.body,
        releaseDate: req.body.releaseDate
      }
    })
    return res.send(formatPlatformDates(platform))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).send({ message: 'Plateforme non trouvée' })
      }
      if (error.code === 'P2002') {
        return res.status(400).send({ message: 'Le nom de la plateforme doit être unique' })
      }
    }
    throw error
  }
}

// DELETE handler with admin check
export async function deletePlatform(server: FastifyServerInstance, req: any, res: any) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).send({ message: 'Action non autorisée' })
  }

  const id = req.params?.id || req.query?.id
  try {
    await server.prisma.platform.delete({
      where: { id }
    })
    return res.status(204).send()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).send({ message: 'Plateforme non trouvée' })
    }
    throw error
  }
}
