import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import type { AuthUser } from '@/types/auth';

const TOKEN_COOKIE = 'auth_token';

export async function GET() {
  try {
    const tokenUser = await getCurrentUser();

    if (!tokenUser) {
      // Clear invalid token cookie
      const response = NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );

      response.cookies.set(TOKEN_COOKIE, '', {
        expires: new Date(0),
        path: '/',
      });

      return response;
    }

    // Verify user in database
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastPasswordChange: true,
        avatarUrl: true,
      },
    });

    if (!user || !user.isActive) {
      const response = NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );

      response.cookies.set(TOKEN_COOKIE, '', {
        expires: new Date(0),
        path: '/',
      });

      return response;
    }

    return NextResponse.json<{ user: AuthUser }>({
      user: {
        ...user,
        lastPasswordChange: user.lastPasswordChange.toISOString(),
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
