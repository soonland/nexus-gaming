import { NotificationType } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.notificationPreference.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ data: preferences });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, email, inApp } = body;

    // Validate notification type
    if (!type || !Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: 'Valid notification type is required' },
        { status: 400 }
      );
    }

    // Prevent disabling system alert in-app notifications
    if (type === 'SYSTEM_ALERT' && typeof inApp !== 'undefined') {
      return NextResponse.json(
        { error: 'Les alertes système in-app ne peuvent pas être modifiées' },
        { status: 400 }
      );
    }

    // Update or create preference
    const preference = await prisma.notificationPreference.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type,
        },
      },
      update: {
        ...(typeof email === 'boolean' && { email }),
        ...(typeof inApp === 'boolean' && { inApp }),
      },
      create: {
        userId: user.id,
        type,
        email: email ?? false,
        inApp: type === 'SYSTEM_ALERT' ? true : (inApp ?? false),
      },
    });

    return NextResponse.json({ data: preference });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
