import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import { canManageAnnouncements } from '@/lib/permissions'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { isActive } = await request.json()

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const announcement = await prisma.adminAnnouncement.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error updating announcement status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
