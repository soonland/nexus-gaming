import { compare } from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { signToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import type { IAuthResponse, ILoginCredentials } from '@/types/auth';

const TOKEN_COOKIE = 'auth_token';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ILoginCredentials;

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
        lastPasswordChange: true,
        lastLogin: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const validPassword = await compare(body.password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Update lastLogin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastPasswordChange: true,
        lastLogin: true,
        avatarUrl: true,
      },
    });

    // Convert dates to ISO strings
    const userWithFormattedDates = {
      ...updatedUser,
      lastPasswordChange: updatedUser.lastPasswordChange.toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString(),
    };

    const userWithoutPassword = userWithFormattedDates;
    const token = await signToken(userWithoutPassword);

    const response = NextResponse.json<IAuthResponse>({
      user: userWithoutPassword,
      token,
    });

    // Set httpOnly cookie
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
