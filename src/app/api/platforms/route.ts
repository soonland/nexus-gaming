import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import type { IPlatformForm } from '@/types';

// GET - Liste des plateformes
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';
    const sortField = searchParams.get('sortField') ?? 'name';
    const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as
      | 'asc'
      | 'desc';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              manufacturer: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : undefined;

    // Validate sort field
    const validSortFields = [
      'name',
      'manufacturer',
      'releaseDate',
      'createdAt',
      'updatedAt',
    ] as const;
    const validatedSortField = validSortFields.includes(sortField as any)
      ? sortField
      : 'name';

    // Build orderBy
    const orderBy = {
      [validatedSortField]: sortOrder,
    };

    // Get platforms with pagination
    const [platforms, totalResults] = await Promise.all([
      prisma.platform.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          name: true,
          manufacturer: true,
          color: true,
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
        orderBy,
      }),
      prisma.platform.count(),
    ]);

    const formattedPlatforms = platforms.map(platform => ({
      ...platform,
      createdAt: new Date(platform.createdAt),
      updatedAt: new Date(platform.updatedAt),
      releaseDate: platform.releaseDate ? new Date(platform.releaseDate) : null,
    }));

    return NextResponse.json({
      platforms: formattedPlatforms,
      pagination: {
        total: totalResults,
        pages: Math.ceil(totalResults / limit),
        page,
        limit,
      },
    });
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
    const body = (await request.json()) as IPlatformForm;
    const { name, manufacturer, color, releaseDate } = body;

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
        color,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        color: true,
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
