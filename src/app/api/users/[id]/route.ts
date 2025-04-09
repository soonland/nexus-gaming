import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import { Role, Prisma } from '@prisma/client'
import { hashPassword } from '@/lib/password'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser || (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastPasswordChange: true,
        passwordExpiresAt: true,
        _count: {
          select: { articles: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...user,
        lastPasswordChange: user.lastPasswordChange?.toISOString(),
        passwordExpiresAt: user.passwordExpiresAt?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser || (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, email, role } = body

    // Basic validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username or email already exists for other users
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ],
        NOT: {
          id
        }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Get the user being edited
    const targetUser = await prisma.user.findUnique({
      where: { id}
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // SYSADMIN role checks
    if (targetUser.role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can modify SYSADMIN users' },
        { status: 403 }
      )
    }

    if (role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can grant SYSADMIN role' },
        { status: 403 }
      )
    }

    // Update user
    const updateData: Prisma.UserUpdateInput = {
      username,
      email,
      role: role as Role
    }

    // Add hashed password and update expiration if password is provided
    if (body.password) {
      updateData.password = await hashPassword(body.password)
      updateData.lastPasswordChange = new Date()
      updateData.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastPasswordChange: true,
        passwordExpiresAt: true
      }
    })

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...user,
        lastPasswordChange: user.lastPasswordChange?.toISOString(),
        passwordExpiresAt: user.passwordExpiresAt?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = await getCurrentUser()
    const { id } = await params
    if (!tokenUser || (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // SYSADMIN checks
    if (targetUser.role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can delete SYSADMIN users' },
        { status: 403 }
      )
    }

    if (targetUser.id === tokenUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Route for toggling user status (active/inactive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = await getCurrentUser()
    const { id } = await params
    if (!tokenUser || (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // SYSADMIN checks
    if (targetUser.role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can modify SYSADMIN users' },
        { status: 403 }
      )
    }

    if (targetUser.id === tokenUser.id) {
      return NextResponse.json(
        { error: 'Cannot change your own status' },
        { status: 400 }
      )
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastPasswordChange: true,
        passwordExpiresAt: true
      }
    })

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...updatedUser,
        lastPasswordChange: updatedUser.lastPasswordChange?.toISOString(),
        passwordExpiresAt: updatedUser.passwordExpiresAt?.toISOString(),
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
