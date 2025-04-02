import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  console.log('GET /api/articles - Fetching articles...')
  
  try {
    const articles = await prisma.article.findMany({
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
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    // Transform the data to flatten the games structure
    const transformedArticles = articles.map(article => ({
      ...article,
      games: article.games.map(g => g.game),
    }))

    console.log(`GET /api/articles - Found ${articles.length} articles`)
    
    if (!articles.length) {
      console.warn('GET /api/articles - No articles found in database')
    }

    return NextResponse.json(transformedArticles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    
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
