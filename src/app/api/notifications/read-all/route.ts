import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: ids must be an array' },
        { status: 400 }
      );
    }

    // Update all notifications that belong to the user and are in the provided ids array
    const result = await prisma.systemNotification.updateMany({
      where: {
        id: { in: ids },
        userId: user.id, // Ensure user can only update their own notifications
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      count: result.count,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
