import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET - Liste des articles publics uniquement
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for public route (only published articles)
    const where: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
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
        orderBy: {
          publishedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
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

    const formattedArticles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt).toISOString(),
      updatedAt: new Date(article.updatedAt).toISOString(),
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : null,
    }));

    return NextResponse.json({
      articles: formattedArticles,
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
