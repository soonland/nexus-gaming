import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { canManageAnnouncements } from '@/lib/permissions'
import { getCurrentUser } from '@/lib/jwt'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()
    const { isActive } = data

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive status is required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.adminAnnouncement.update({
      where: { id: params.id },
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
    console.error('Error updating announcement status:', error)
    return NextResponse.json(
      { error: 'Error updating announcement status' },
      { status: 500 }
    )
  }
}
