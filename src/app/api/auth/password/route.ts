import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const tokenUser = await getCurrentUser();

    if (!tokenUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current and new passwords are required' },
        { status: 400 }
      );
    }

    // Get user with password
    const existingUser = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password and delete notifications in a transaction
    const result = await prisma.$transaction(async tx => {
      // Update password
      const updatedUser = await tx.user.update({
        where: { id: tokenUser.id },
        data: {
          password: await hashPassword(newPassword),
          lastPasswordChange: new Date(),
        },
        select: {
          id: true,
          lastPasswordChange: true,
        },
      });

      // Delete password expiration notifications
      await tx.systemNotification.deleteMany({
        where: {
          userId: tokenUser.id,
          type: 'PASSWORD_EXPIRATION',
        },
      });

      return updatedUser;
    });

    return NextResponse.json({
      user: {
        ...result,
        lastPasswordChange: result.lastPasswordChange.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
