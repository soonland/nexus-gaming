import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Détails d'une société
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            gamesAsDev: true,
            gamesAsPub: true,
          },
        },
        gamesAsDev: {
          select: {
            id: true,
            title: true,
          },
          take: 5,
        },
        gamesAsPub: {
          select: {
            id: true,
            title: true,
          },
          take: 5,
        },
      },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Error fetching company' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour une société
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, isDeveloper, isPublisher } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!isDeveloper && !isPublisher) {
      return NextResponse.json(
        { error: 'Company must be either developer or publisher' },
        { status: 400 }
      )
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        isDeveloper,
        isPublisher,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Error updating company' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une société
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    await prisma.company.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: 'Error deleting company' },
      { status: 500 }
    )
  }
}
