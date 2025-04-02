import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import type { AuthUser } from '@/types/auth'

export async function GET() {
  try {
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<{ user: AuthUser }>({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
