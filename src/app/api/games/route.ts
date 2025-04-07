import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { GameData, GameForm } from '@/types'

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        developer: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true
              }
            }
          }
        },
        publisher: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true
              }
            }
          }
        },
        platforms: {
          select: {
            id: true,
            name: true,
          },
        },
        articles: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    })

    const formattedGames = games.map(game => ({
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      developer: {
        ...game.developer,
        createdAt: new Date(game.developer.createdAt),
        updatedAt: new Date(game.developer.updatedAt)
      },
      publisher: {
        ...game.publisher,
        createdAt: new Date(game.publisher.createdAt),
        updatedAt: new Date(game.publisher.updatedAt)
      }
    }))
    return NextResponse.json(formattedGames)
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
    const data = (await request.json()) as GameForm

    const game = await prisma.game.create({
      data: {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        coverImage: data.coverImage,
        developer: {
          connect: { id: data.developerId }
        },
        publisher: {
          connect: { id: data.publisherId }
        },
        platforms: {
          connect: data.platformIds.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        developer: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true
              }
            }
          }
        },
        publisher: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true
              }
            }
          }
        },
        platforms: {
          select: {
            id: true,
            name: true,
          },
        },
        articles: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    const formattedGame = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      developer: {
        ...game.developer,
        createdAt: new Date(game.developer.createdAt),
        updatedAt: new Date(game.developer.updatedAt)
      },
      publisher: {
        ...game.publisher,
        createdAt: new Date(game.publisher.createdAt),
        updatedAt: new Date(game.publisher.updatedAt)
      }
    }
    return NextResponse.json(formattedGame)
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Error creating game' },
      { status: 500 }
    )
  }
}
