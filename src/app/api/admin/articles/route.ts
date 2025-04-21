import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import type { ArticleForm } from '@/types';

export async function GET(request: Request) {
  try {
    // Auth check for admin routes
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      // ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Get articles with pagination
    const [articles, totalResults] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          heroImage: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          games: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        total: totalResults,
        pages: Math.ceil(totalResults / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Error fetching articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Auth check for admin routes
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = (await request.json()) as ArticleForm;
    const {
      title,
      content,
      categoryId,
      status,
      publishedAt,
      gameIds = [],
      heroImage,
    } = data;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        userId: user.id,
        heroImage,
        games: {
          connect: gameIds.map(id => ({ id })),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        heroImage: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        games: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Error creating article' },
      { status: 500 }
    );
  }
}
