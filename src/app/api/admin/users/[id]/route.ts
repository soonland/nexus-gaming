import type { Role, Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import { hasSufficientRole } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenUser = await getCurrentUser();

    if (!hasSufficientRole(tokenUser?.role, 'SENIOR_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...user,
        lastPasswordChange: user.lastPasswordChange?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenUser = await getCurrentUser();

    if (!tokenUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!hasSufficientRole(tokenUser.role, 'SENIOR_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, role, isActive } = body;

    // Basic validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if username or email already exists for other users
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
        NOT: {
          id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Get the user being edited
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient role to modify target user
    if (!hasSufficientRole(tokenUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can modify SYSADMIN users' },
        { status: 403 }
      );
    }

    // Check if user has sufficient role to grant the requested role
    if (role && !hasSufficientRole(tokenUser.role, role as Role)) {
      return NextResponse.json(
        { error: 'You cannot grant a role equal to or higher than your own' },
        { status: 403 }
      );
    }

    // Special case for SYSADMIN role
    if (role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can grant SYSADMIN role' },
        { status: 403 }
      );
    }

    // Update user
    const updateData: Prisma.UserUpdateInput = {
      username,
      email,
      role: role as Role,
      isActive,
    };

    // Add hashed password and update expiration if password is provided
    if (body.password) {
      updateData.password = await hashPassword(body.password);
      updateData.lastPasswordChange = new Date();
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
      },
    });

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...user,
        lastPasswordChange: user.lastPasswordChange?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = await getCurrentUser();
    const { id } = await params;

    if (!tokenUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!hasSufficientRole(tokenUser.role, 'SENIOR_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient role to delete target user
    if (!hasSufficientRole(tokenUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can delete SYSADMIN users' },
        { status: 403 }
      );
    }

    // Empêcher un SYSADMIN de supprimer son propre compte
    if (targetUser.id === tokenUser.id && tokenUser.role === 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Un SYSADMIN ne peut pas supprimer son propre compte.' },
        { status: 403 }
      );
    }

    if (targetUser.id === tokenUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Route for toggling user status (active/inactive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = await getCurrentUser();
    const { id } = await params;

    if (!tokenUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!hasSufficientRole(tokenUser.role, 'SENIOR_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient role to modify target user
    if (!hasSufficientRole(tokenUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can modify SYSADMIN users' },
        { status: 403 }
      );
    }

    if (targetUser.id === tokenUser.id) {
      return NextResponse.json(
        { error: 'Cannot change your own status' },
        { status: 400 }
      );
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
      },
    });

    // Convert Date objects to ISO strings for API response
    return NextResponse.json({
      user: {
        ...updatedUser,
        lastPasswordChange: updatedUser.lastPasswordChange?.toISOString(),
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
