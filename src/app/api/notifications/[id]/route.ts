import { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { isValidNotificationLevel } from '@/lib/notifications';
import prisma from '@/lib/prisma';
import type { NotificationLevel } from '@/types/notifications';

interface IUpdateNotificationDto {
  isRead?: boolean;
  title?: string;
  message?: string;
  level?: NotificationLevel;
  expiresAt?: Date | null;
  data?: Prisma.JsonValue | null;
}

function validateUpdate(update: Partial<IUpdateNotificationDto>) {
  const errors: string[] = [];

  // Validate level if provided
  if (update.level !== undefined && !isValidNotificationLevel(update.level)) {
    errors.push('Invalid notification level');
  }

  // Validate title if provided
  if (update.title !== undefined) {
    if (!update.title.trim() || update.title.length > 255) {
      errors.push('Title must be between 1 and 255 characters');
    }
  }

  // Validate message if provided
  if (update.message !== undefined) {
    if (!update.message.trim() || update.message.length > 1000) {
      errors.push('Message must be between 1 and 1000 characters');
    }
  }

  // Validate expiresAt if provided
  if (update.expiresAt !== undefined && update.expiresAt !== null) {
    const expiresAt = new Date(update.expiresAt);
    if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      errors.push('Expiration date must be a valid future date');
    }
  }

  return errors;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get and validate update data
    const update = (await request.json()) as Partial<IUpdateNotificationDto>;
    const validationErrors = validateUpdate(update);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Update notification
    const notification = await prisma.systemNotification.findFirst({
      where: {
        id: params.id,
        userId: user.id, // Ensure user owns the notification
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Convert update data to Prisma-compatible format
    const updateData: Prisma.SystemNotificationUncheckedUpdateInput = {
      ...(update.isRead !== undefined && { isRead: update.isRead }),
      ...(update.title !== undefined && { title: update.title }),
      ...(update.message !== undefined && { message: update.message }),
      ...(update.level !== undefined && { level: update.level }),
      ...(update.expiresAt !== undefined && {
        expiresAt: update.expiresAt,
      }),
      ...(update.data !== undefined && {
        data: update.data === null ? Prisma.JsonNull : update.data,
      }),
    };

    const updatedNotification = await prisma.systemNotification.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ data: updatedNotification });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = await prisma.systemNotification.findFirst({
      where: {
        id: params.id,
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

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = await prisma.systemNotification.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await prisma.systemNotification.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
