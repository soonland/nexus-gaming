import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { canManageAnnouncements } from '@/lib/permissions'
import { getCurrentUser } from '@/lib/jwt'
import { AnnouncementType } from '@prisma/client'

// GET - Liste des annonces
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const announcements = await prisma.adminAnnouncement.findMany({
      select: {
        id: true,
        message: true,
        type: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Error fetching announcements' },
      { status: 500 }
    )
  }
}

// POST - Créer une annonce
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()
    const { message, type, expiresAt } = data

    if (!message || !type || !Object.values(AnnouncementType).includes(type)) {
      return NextResponse.json(
        { error: 'Message and valid type are required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.adminAnnouncement.create({
      data: {
        message,
        type,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdById: user.id,
      },
      select: {
        id: true,
        message: true,
        type: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Error creating announcement' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une annonce
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()
    const { id, isActive } = data

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'ID and isActive status are required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.adminAnnouncement.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        message: true,
        type: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Error updating announcement' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une annonce
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    await prisma.adminAnnouncement.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { error: 'Error deleting announcement' },
      { status: 500 }
    )
  }
}
