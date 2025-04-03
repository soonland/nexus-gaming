import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
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

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Error fetching games' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, releaseDate, developerId, publisherId, coverImage, platformIds } = body

    const game = await prisma.game.create({
      data: {
        title,
        description,
        releaseDate,
        developerId,
        publisherId,
        coverImage,
        platforms: {
          connect: platformIds.map((id: string) => ({ id })),
        },
      },
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
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Error creating game' },
      { status: 500 }
    )
  }
}
