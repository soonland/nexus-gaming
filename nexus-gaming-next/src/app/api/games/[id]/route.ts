import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: {
        id: params.id,
      },
      include: {
        platforms: {
          select: {
            id: true,
            name: true,
            manufacturer: true,
            releaseDate: true,
          },
        },
        developer: {
          select: {
            id: true,
            name: true,
          },
        },
        publisher: {
          select: {
            id: true,
            name: true,
          },
        },
        articles: {
          select: {
            article: {
              select: {
                id: true,
                title: true,
                content: true,
                publishedAt: true,
                category: {
                  select: {
                    name: true,
                  },
                },
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
          take: 3,
          orderBy: {
            article: {
              publishedAt: 'desc',
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Transform the data to flatten the articles structure
    const transformedGame = {
      ...game,
      articles: game.articles.map(a => a.article),
    }

    return NextResponse.json(transformedGame)
  } catch (error) {
    console.error('Error fetching game:', error)
    
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
