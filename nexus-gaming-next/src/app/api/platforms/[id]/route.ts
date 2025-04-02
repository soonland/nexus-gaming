import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
      include: {
        games: {
          select: {
            id: true,
            title: true,
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

    return NextResponse.json(platform)
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
    const body = await request.json()
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
        releaseDate,
      },
    })

    return NextResponse.json(platform)
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
