import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canManageAnnouncements } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !canManageAnnouncements(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const { isActive } = data;

    if (!['active', 'inactive'].includes(isActive)) {
      return NextResponse.json(
        { error: 'isActive must be "active" or "inactive"' },
        { status: 400 }
      );
    }

    const announcement = await prisma.adminAnnouncement.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
