import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const game = await prisma.game.findUnique({
      where: { id },
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

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Error fetching game' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, releaseDate, developerId, publisherId, coverImage, platformIds } = body

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        description,
        releaseDate,
        developerId,
        publisherId,
        coverImage,
        platforms: {
          set: platformIds.map((id: string) => ({ id })),
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

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: 'Error updating game' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.game.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Error deleting game' },
      { status: 500 }
    )
  }
}
