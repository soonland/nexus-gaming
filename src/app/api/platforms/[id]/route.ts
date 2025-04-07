import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { PlatformForm } from '@/types'

// GET - Détails d'une plateforme
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            releaseDate: true,
          },
        },
      },
    })

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      )
    }

    const formattedPlatform = {
      ...platform,
      createdAt: new Date(platform.createdAt),
      updatedAt: new Date(platform.updatedAt),
      releaseDate: platform.releaseDate ? new Date(platform.releaseDate) : null,
      games: platform.games.map(game => ({
        ...game,
        releaseDate: game.releaseDate ? new Date(game.releaseDate) : null
      }))
    }

    return NextResponse.json(formattedPlatform)
  } catch (error) {
    console.error('Error fetching platform:', error)
    return NextResponse.json(
      { error: 'Error fetching platform' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour une plateforme
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as PlatformForm
    const { name, manufacturer, releaseDate } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      )
    }

    if (!name || !manufacturer) {
      return NextResponse.json(
        { error: 'Name and manufacturer are required' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.update({
      where: { id },
      data: {
        name,
        manufacturer,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            releaseDate: true,
          },
        },
      },
    })

    const formattedPlatform = {
      ...platform,
      createdAt: new Date(platform.createdAt),
      updatedAt: new Date(platform.updatedAt),
      releaseDate: platform.releaseDate ? new Date(platform.releaseDate) : null,
      games: platform.games.map(game => ({
        ...game,
        releaseDate: game.releaseDate ? new Date(game.releaseDate) : null
      }))
    }

    return NextResponse.json(formattedPlatform)
  } catch (error) {
    console.error('Error updating platform:', error)
    return NextResponse.json(
      { error: 'Error updating platform' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une plateforme
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      )
    }

    await prisma.platform.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting platform:', error)
    return NextResponse.json(
      { error: 'Error deleting platform' },
      { status: 500 }
    )
  }
}
