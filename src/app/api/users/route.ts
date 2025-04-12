import type { Prisma, Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const tokenUser = await getCurrentUser();

    if (
      !tokenUser ||
      (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    // Calculate pagination
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
        orderBy: { createdAt: 'desc' },
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

export async function PUT(request: Request) {
  try {
    const tokenUser = await getCurrentUser();

    if (
      !tokenUser ||
      (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, email, password, role, isActive } = body;

    // Get the user being edited
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // SYSADMIN role checks
    if (targetUser.role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can modify SYSADMIN users' },
        { status: 403 }
      );
    }

    if (role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can grant SYSADMIN role' },
        { status: 403 }
      );
    }

    // Hash password if provided and update user
    const updateData: Prisma.UserUpdateInput = {
      username,
      email,
      role,
      isActive,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
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
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const tokenUser = await getCurrentUser();

    if (
      !tokenUser ||
      (tokenUser.role !== 'ADMIN' && tokenUser.role !== 'SYSADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role = 'USER' } = body;

    // Only SYSADMIN can create SYSADMIN users
    if (role === 'SYSADMIN' && tokenUser.role !== 'SYSADMIN') {
      return NextResponse.json(
        { error: 'Only SYSADMIN users can create other SYSADMIN users' },
        { status: 403 }
      );
    }

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
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
