import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  console.log('GET /api/games - Fetching games...')
  
  try {
    const games = await prisma.game.findMany({
      include: {
        platforms: {
          select: {
            name: true,
          },
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`GET /api/games - Found ${games.length} games`)
    
    if (!games.length) {
      console.warn('GET /api/games - No games found in database')
    }

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    
    // Determine if it's a Prisma error
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
