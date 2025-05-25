import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET - Liste des annonces publiques (accessibles aux editors)
export async function GET() {
  try {
    const announcements = await prisma.adminAnnouncement.findMany({
      where: {
        isActive: 'active',
        visibility: 'PUBLIC',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: {
        id: true,
        message: true,
        type: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Error fetching announcements' },
      { status: 500 }
    );
  }
}
