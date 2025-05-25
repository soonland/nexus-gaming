import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/slug';
import type { IGameForm } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const game = await prisma.game.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        genre: true,
        createdAt: true,
        updatedAt: true,
        developerId: true,
        publisherId: true,
        platforms: {
          select: {
            id: true,
            name: true,
            manufacturer: true,
            color: true,
            releaseDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        articles: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            title: true,
            content: true,
            publishedAt: true,
            status: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
        },
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
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const formattedGame = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      platforms: game.platforms.map(platform => ({
        ...platform,
        releaseDate: platform.releaseDate
          ? new Date(platform.releaseDate)
          : null,
      })),
      articles: game.articles.map(article => ({
        ...article,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      })),
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
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Error fetching game' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = (await request.json()) as IGameForm;

    // Validation des champs requis
    if (!data.title || !data.developerId || !data.publisherId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug: generateSlug(data.title),
        description: data.description?.trim() || null,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        coverImage: data.coverImage,
        genre: data.genre,
        platforms: {
          set: [], // Déconnecte toutes les plateformes
          connect:
            data.platformIds?.map((platformId: string) => ({
              id: platformId,
            })) || [],
        },
        developer: {
          connect: { id: data.developerId },
        },
        publisher: {
          connect: { id: data.publisherId },
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
        platforms: {
          select: {
            id: true,
            name: true,
            manufacturer: true,
            color: true,
            releaseDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });

    const formattedGame = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      platforms: game.platforms.map(platform => ({
        ...platform,
        releaseDate: platform.releaseDate
          ? new Date(platform.releaseDate)
          : null,
      })),
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
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Error updating game' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};

    // Ne met à jour que les champs fournis
    if (data.title !== undefined) {
      updateData.title = data.title.trim();
      updateData.slug = generateSlug(data.title);
    }
    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }
    if (data.releaseDate !== undefined) {
      updateData.releaseDate = data.releaseDate
        ? new Date(data.releaseDate)
        : null;
    }
    if (data.coverImage !== undefined) {
      updateData.coverImage = data.coverImage;
    }
    if (data.genre !== undefined) {
      updateData.genre = data.genre;
    }
    if (data.developerId !== undefined) {
      updateData.developer = { connect: { id: data.developerId } };
    }
    if (data.publisherId !== undefined) {
      updateData.publisher = { connect: { id: data.publisherId } };
    }
    if (data.platformIds !== undefined) {
      updateData.platforms = {
        connect: data.platformIds.map((platformId: string) => ({
          id: platformId,
        })),
      };
    }

    const game = await prisma.game.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        genre: true,
        createdAt: true,
        updatedAt: true,
        platforms: {
          select: {
            id: true,
            name: true,
            manufacturer: true,
            color: true,
            releaseDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });

    const formattedGame = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : null,
      platforms: game.platforms.map(platform => ({
        ...platform,
        releaseDate: platform.releaseDate
          ? new Date(platform.releaseDate)
          : null,
      })),
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
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Error updating game' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.game.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Error deleting game' }, { status: 500 });
  }
}
