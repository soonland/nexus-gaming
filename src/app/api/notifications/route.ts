import { NotificationType, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as NotificationType | null;

    // Validate type if provided
    if (type && !Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    // Get user's notification preferences
    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: user.id },
    });

    // Get enabled notification types
    const enabledTypes = preferences.filter(p => p.inApp).map(p => p.type);

    // If no types are enabled and no specific type is requested, return empty
    if (enabledTypes.length === 0 && !type) {
      return NextResponse.json({ data: [] });
    }

    const notifications = await prisma.systemNotification.findMany({
      where: {
        userId: user.id,
        ...(type && { type }),
        // If no specific type is requested, filter by enabled types
        ...(!type && {
          type: {
            in: enabledTypes,
          },
        }),
        AND: [
          {
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        ],
      },
      orderBy: [
        { isRead: 'asc' }, // Non lues en premier
        { createdAt: 'desc' }, // Plus récentes d'abord
      ],
      select: {
        id: true,
        type: true,
        level: true,
        title: true,
        message: true,
        isRead: true,
        data: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, level, title, message, data, expiresAt } = body;

    // Validate notification type
    if (!type || !Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: 'Valid notification type is required' },
        { status: 400 }
      );
    }

    // Check if the user has enabled this notification type
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        userId_type: {
          userId: user.id,
          type,
        },
      },
    });

    // Only create notification if inApp preference is enabled or no preference exists
    if (preference?.inApp === false) {
      return NextResponse.json({
        error: 'Notification type is disabled by user preferences',
      });
    }

    const notification = await prisma.systemNotification.create({
      data: {
        type,
        level,
        title,
        message,
        data: data || Prisma.JsonNull,
        expiresAt,
        userId: user.id,
      },
      select: {
        id: true,
        type: true,
        level: true,
        title: true,
        message: true,
        isRead: true,
        data: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
