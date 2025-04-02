import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing article ID' },
        { status: 400 }
      )
    }

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        games: {
          select: {
            game: {
              select: {
                id: true,
                title: true,
                coverImage: true,
                developer: {
                  select: {
                    name: true,
                  },
                },
                publisher: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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

    // Transform the data to flatten the games structure
    const transformedArticle = {
      ...article,
      games: article.games.map(g => g.game),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error('Error fetching article:', error)
    
    const isPrismaError = error instanceof Error && 'code' in error
    const errorMessage = isPrismaError 
      ? 'Database error occurred'
      : 'Internal server error'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
