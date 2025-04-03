import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'

// GET - Liste des articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedArticles = articles.map(article => ({
      ...article,
      games: article.games.map(g => g.game),
    }))

    return NextResponse.json(formattedArticles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Error fetching articles' },
      { status: 500 }
    )
  }
}

// POST - Créer un article
export async function POST(request: Request) {
  try {
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

    const article = await prisma.article.create({
      data: {
        title,
        content,
        categoryId: categoryId || null,
        userId: user.id,
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

    return NextResponse.json(formattedArticle, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Error creating article' },
      { status: 500 }
    )
  }
}
