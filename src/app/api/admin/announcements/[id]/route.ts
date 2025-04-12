import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canManageAnnouncements } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const announcement = await prisma.adminAnnouncement.findUnique({
      where: { id },
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

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Error fetching announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { message, type, expiresAt, isActive } = data;

    if (!message || !type) {
      return NextResponse.json(
        { error: 'Message and type are required' },
        { status: 400 }
      );
    }

    const announcement = await prisma.adminAnnouncement.update({
      where: { id },
      data: {
        message,
        type,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: ['active', 'inactive'].includes(isActive)
          ? isActive
          : 'active',
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

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Error updating announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.adminAnnouncement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Error deleting announcement' },
      { status: 500 }
    );
  }
}
