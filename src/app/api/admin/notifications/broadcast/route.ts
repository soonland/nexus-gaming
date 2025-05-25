import type { NotificationType, Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/jwt';
import { canBroadcastNotifications } from '@/lib/permissions';
import prisma from '@/lib/prisma';

const broadcastSchema = z.object({
  type: z.literal('SYSTEM_ALERT'),
  level: z.enum(['info', 'warning', 'urgent', 'error']),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  roleMin: z.enum([
    'USER',
    'MODERATOR',
    'EDITOR',
    'SENIOR_EDITOR',
    'ADMIN',
    'SYSADMIN',
  ]),
  expiresAt: z.string().datetime().nullable(),
});

// Fonction utilitaire pour obtenir tous les rôles supérieurs ou égaux au rôle minimum
function getRolesFromMin(minRole: Role): Role[] {
  const roleHierarchy: Role[] = [
    'USER',
    'MODERATOR',
    'EDITOR',
    'SENIOR_EDITOR',
    'ADMIN',
    'SYSADMIN',
  ];
  const minIndex = roleHierarchy.indexOf(minRole);
  return roleHierarchy.slice(minIndex);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !canBroadcastNotifications(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = broadcastSchema.parse(body);

    // Get all active users
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          in: getRolesFromMin(validatedData.roleMin),
        },
      },
      select: { id: true },
    });

    // Create a notification for each user considering their preferences
    const notifications = await prisma.$transaction(async tx => {
      // Get preferences for all users for this notification type
      const preferences = await tx.notificationPreference.findMany({
        where: {
          userId: { in: users.map(u => u.id) },
          type: validatedData.type as NotificationType,
        },
      });

      // Create notifications only for users who haven't disabled them
      const notificationsToCreate = users
        .filter(user => {
          const pref = preferences.find(p => p.userId === user.id);
          // Create if no preference exists or if inApp is enabled
          return !pref || pref.inApp;
        })
        .map(user => ({
          userId: user.id,
          type: validatedData.type,
          level: validatedData.level,
          title: validatedData.title,
          message: validatedData.message,
          expiresAt: validatedData.expiresAt
            ? new Date(validatedData.expiresAt)
            : null,
        }));

      return tx.systemNotification.createMany({
        data: notificationsToCreate,
      });
    });

    return NextResponse.json({ data: notifications }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error broadcasting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast notifications' },
      { status: 500 }
    );
  }
}
