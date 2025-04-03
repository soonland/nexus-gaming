import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import { cookies } from 'next/headers'

// GET - Détails d'un article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        games: {
          select: {
            game: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const formattedArticle = {
      ...article,
      games: article.games.map(g => g.game),
    }

    return NextResponse.json(formattedArticle)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Error fetching article' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour un article
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, categoryId, gameIds } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Vérifier que l'article existe et appartient à l'utilisateur
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    if (existingArticle.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Supprimer les relations existantes avec les jeux
    await prisma.articleGame.deleteMany({
      where: { articleId: id },
    })

    // Mettre à jour l'article avec les nouvelles relations
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        categoryId: categoryId || null,
        games: {
          create: gameIds.map((gameId: string) => ({
            game: {
              connect: { id: gameId },
            },
          })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        games: {
          select: {
            game: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    const formattedArticle = {
      ...article,
      games: article.games.map(g => g.game),
    }

    return NextResponse.json(formattedArticle)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Error updating article' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Vérifier que l'article existe et appartient à l'utilisateur
    const article = await prisma.article.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    if (article.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    await prisma.article.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Error deleting article' },
      { status: 500 }
    )
  }
}
