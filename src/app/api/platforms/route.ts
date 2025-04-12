import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import type { PlatformForm } from '@/types';

// GET - Liste des plateformes
export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      select: {
        id: true,
        name: true,
        manufacturer: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedPlatforms = platforms.map(platform => ({
      ...platform,
      createdAt: new Date(platform.createdAt),
      updatedAt: new Date(platform.updatedAt),
      releaseDate: platform.releaseDate ? new Date(platform.releaseDate) : null,
    }));

    return NextResponse.json(formattedPlatforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'Error fetching platforms' },
      { status: 500 }
    );
  }
}

// POST - Créer une plateforme
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlatformForm;
    const { name, manufacturer, releaseDate } = body;

    if (!name || !manufacturer) {
      return NextResponse.json(
        { error: 'Name and manufacturer are required' },
        { status: 400 }
      );
    }

    const platform = await prisma.platform.create({
      data: {
        name,
        manufacturer,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    const formattedPlatform = {
      ...platform,
      createdAt: new Date(platform.createdAt),
      updatedAt: new Date(platform.updatedAt),
      releaseDate: platform.releaseDate ? new Date(platform.releaseDate) : null,
    };

    return NextResponse.json(formattedPlatform, { status: 201 });
  } catch (error) {
    console.error('Error creating platform:', error);
    return NextResponse.json(
      { error: 'Error creating platform' },
      { status: 500 }
    );
  }
}
