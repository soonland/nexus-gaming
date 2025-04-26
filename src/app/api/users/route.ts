import type { Prisma, Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import { canAssignRole, canCreateUsers } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const tokenUser = await getCurrentUser();

    if (!tokenUser || !canCreateUsers(tokenUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const rawPage = searchParams.get('page');
    const rawLimit = searchParams.get('limit');
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    // Validate and sanitize pagination params
    const page = Math.max(1, parseInt(rawPage ?? '1') || 1);
    const limit = Math.max(1, Math.min(100, parseInt(rawLimit ?? '10') || 10));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  username: {
                    contains: search,
                    mode: 'insensitive' as Prisma.QueryMode,
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive' as Prisma.QueryMode,
                  },
                },
              ],
            }
          : {},
        role ? { role: role as Role } : {},
        status ? { isActive: status === 'active' } : {},
      ],
    };

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { articles: true },
          },
        },
        skip,
        take: limit,
        orderBy: { username: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const tokenUser = await getCurrentUser();

    if (!tokenUser || !canCreateUsers(tokenUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role = 'USER', isActive } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user has sufficient role to grant the requested role
    if (!canAssignRole(tokenUser.role, role as Role)) {
      return NextResponse.json(
        { error: 'You cannot assign this role level' },
        { status: 403 }
      );
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user with welcome notification
    const hashedPassword = await hashPassword(password);
    const user = await prisma.$transaction(async tx => {
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
          isActive,
        },
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

      // Create default system alert preferences
      await tx.notificationPreference.create({
        data: {
          userId: newUser.id,
          type: 'SYSTEM_ALERT',
          email: false,
          inApp: true,
        },
      });

      // Create welcome notification
      await tx.systemNotification.create({
        data: {
          userId: newUser.id,
          type: 'SYSTEM_ALERT',
          level: 'info',
          title: 'Bienvenue sur Nexus Gaming',
          message: 'Nous sommes ravis de vous compter parmi nous !',
        },
      });

      return newUser;
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
