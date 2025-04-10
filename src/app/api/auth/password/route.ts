import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import { hashPassword } from '@/lib/password'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current and new passwords are required' },
        { status: 400 }
      )
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: {
        id: true,
        password: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Update password and expiration dates
    const updatedUser = await prisma.user.update({
      where: { id: tokenUser.id },
      data: {
        password: await hashPassword(newPassword),
        lastPasswordChange: new Date(),
        passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
      select: {
        id: true,
        lastPasswordChange: true,
        passwordExpiresAt: true,
      }
    })

    return NextResponse.json({
      user: {
        ...updatedUser,
        lastPasswordChange: updatedUser.lastPasswordChange.toISOString(),
        passwordExpiresAt: updatedUser.passwordExpiresAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
