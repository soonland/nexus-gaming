import { FastifyServerInstance } from '../types/server'
import { Type } from '@sinclair/typebox'

// Schema definitions
export const categorySchema = Type.Object({
  name: Type.String({ minLength: 1 })
})

// GET handler
export async function getAllCategories(server: FastifyServerInstance, req: any, res: any) {
  const categories = await server.prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return res.send(categories)
}

// POST handler
export async function createCategory(server: FastifyServerInstance, req: any, res: any) {
  const { name } = req.body
  const category = await server.prisma.category.create({
    data: {
      name,
    },
  })
  return res.status(201).send(category)
}

// PUT handler
export async function updateCategory(server: FastifyServerInstance, req: any, res: any) {
  const id = req.params?.id || req.query?.id
  const { name } = req.body

  try {
    const category = await server.prisma.category.update({
      where: { id },
      data: { name },
    })
    return res.send(category)
  } catch (error) {
    return res.status(404).send({ message: 'Catégorie non trouvée' })
  }
}

// DELETE handler
export async function deleteCategory(server: FastifyServerInstance, req: any, res: any) {
  const id = req.params?.id || req.query?.id

  try {
    // Use transaction to ensure both operations complete or neither does
    await server.prisma.$transaction([
      // First, update all articles to remove this category
      server.prisma.article.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      }),
      // Then delete the category
      server.prisma.category.delete({
        where: { id },
      })
    ])

    return res.status(204).send()
  } catch (error) {
    return res.status(404).send({ message: 'Catégorie non trouvée' })
  }
}
