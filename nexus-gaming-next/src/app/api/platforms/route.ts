import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Liste des plateformes
export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      include: {
        games: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Error fetching platforms' },
      { status: 500 }
    )
  }
}

// POST - Créer une plateforme
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, manufacturer, releaseDate } = body

    if (!name || !manufacturer) {
      return NextResponse.json(
        { error: 'Name and manufacturer are required' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.create({
      data: {
        name,
        manufacturer,
        releaseDate,
      },
    })

    return NextResponse.json(platform, { status: 201 })
  } catch (error) {
    console.error('Error creating platform:', error)
    return NextResponse.json(
      { error: 'Error creating platform' },
      { status: 500 }
    )
  }
}
