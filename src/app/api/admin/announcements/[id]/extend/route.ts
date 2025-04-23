import { NextResponse } from 'next/server';

import dayjs from '@/lib/dayjs';
import { getCurrentUser } from '@/lib/jwt';
import { canManageAnnouncements } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const { days } = data;

    if (!days || typeof days !== 'number' || days < 1) {
      return NextResponse.json(
        { error: 'Days must be a positive number' },
        { status: 400 }
      );
    }

    const announcement = await prisma.adminAnnouncement.findUnique({
      where: { id },
      select: { expiresAt: true },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    const baseDate = announcement.expiresAt || new Date();
    const newExpiresAt = dayjs(baseDate).add(days, 'day').toDate();

    const updatedAnnouncement = await prisma.adminAnnouncement.update({
      where: { id },
      data: {
        expiresAt: newExpiresAt,
        isActive: 'active',
      },
      select: {
        id: true,
        message: true,
        type: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error extending announcement:', error);
    return NextResponse.json(
      { error: 'Error extending announcement' },
      { status: 500 }
    );
  }
}
