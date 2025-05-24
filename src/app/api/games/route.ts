import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/slug';
import type { IGameForm } from '@/types';

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const isAdminRoute = searchParams.get('admin') === 'true';
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.GameWhereInput = {
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            ],
          }
        : {}),
    };

    // Optimized select clause based on route type
    const select: Prisma.GameSelect = {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      releaseDate: true,
      createdAt: true,
      updatedAt: true,
      developer: {
        select: {
          id: true,
          name: true,
          ...(isAdminRoute && {
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true,
              },
            },
          }),
        },
      },
      publisher: {
        select: {
          id: true,
          name: true,
          ...(isAdminRoute && {
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true,
              },
            },
          }),
        },
      },
      platforms: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      articles: {
        where: {
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          title: true,
          heroImage: true,
        },
      },
    };

    // Get games with pagination and optimized select
    const [games, totalCount] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: limit,
        select,
        orderBy: {
          releaseDate: 'desc',
        },
      }),
      prisma.game.count({ where }),
    ]);

    const formattedGames = games.map(game => ({
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      developer: {
        ...game.developer,
        createdAt: new Date(game.developer.createdAt),
        updatedAt: new Date(game.developer.updatedAt),
      },
      publisher: {
        ...game.publisher,
        createdAt: new Date(game.publisher.createdAt),
        updatedAt: new Date(game.publisher.updatedAt),
      },
    }));

    return NextResponse.json({
      games: formattedGames,
      pagination: {
        total: totalCount,
        pages: Math.max(1, Math.ceil(totalCount / limit)),
        page: totalCount === 0 ? 1 : page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Error fetching games' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as IGameForm;

    const game = await prisma.game.create({
      data: {
        title: data.title,
        slug: generateSlug(data.title),
        description: data.description,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        coverImage: data.coverImage,
        genre: data.genre,
        developer: {
          connect: { id: data.developerId },
        },
        publisher: {
          connect: { id: data.publisherId },
        },
        platforms: {
          connect: data.platformIds.map((id: string) => ({ id })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        genre: true,
        createdAt: true,
        updatedAt: true,
        developer: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true,
              },
            },
          },
        },
        publisher: {
          select: {
            id: true,
            name: true,
            isDeveloper: true,
            isPublisher: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                gamesAsDev: true,
                gamesAsPub: true,
              },
            },
          },
        },
        platforms: {
          select: {
            id: true,
            name: true,
          },
        },
        articles: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const formattedGame = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      developer: {
        ...game.developer,
        createdAt: new Date(game.developer.createdAt),
        updatedAt: new Date(game.developer.updatedAt),
      },
      publisher: {
        ...game.publisher,
        createdAt: new Date(game.publisher.createdAt),
        updatedAt: new Date(game.publisher.updatedAt),
      },
    };
    return NextResponse.json(formattedGame);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Error creating game' }, { status: 500 });
  }
}
