import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'

export async function POST(request: Request) {
  try {
    const tokenUser = await getCurrentUser()
    if (!tokenUser || !['ADMIN', 'SYSADMIN'].includes(tokenUser.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { message, type, expiresAt } = data

    const announcement = await prisma.adminAnnouncement.create({
      data: {
        message,
        type,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdById: tokenUser.id,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error creating announcement:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const tokenUser = await getCurrentUser()
    if (!tokenUser || !['ADMIN', 'SYSADMIN'].includes(tokenUser.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const announcements = await prisma.adminAnnouncement.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const tokenUser = await getCurrentUser()
    if (!tokenUser || !['ADMIN', 'SYSADMIN'].includes(tokenUser.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { id, isActive } = data

    const announcement = await prisma.adminAnnouncement.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
