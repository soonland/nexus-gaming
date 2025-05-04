import { Role } from '@prisma/client';
import type { Prisma, ArticleStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/slug';
import type { ArticleForm } from '@/types';

const ADMIN_ROLES = [Role.SENIOR_EDITOR, Role.ADMIN, Role.SYSADMIN] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

const isAdminRole = (role?: Role): role is AdminRole => {
  return !!role && ADMIN_ROLES.includes(role as AdminRole);
};

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
    const status = searchParams.get('status') ?? '';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const exactSlug = searchParams.get('exactSlug') === 'true';
    const excludeId = searchParams.get('excludeId');

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build base where clause with search and status independently
    const baseWhere: Prisma.ArticleWhereInput = {
      // N'exclure les articles DELETED que si on ne les demande pas spécifiquement
      // et que includeDeleted est false
      ...(!includeDeleted && status !== 'DELETED'
        ? {
            NOT: { status: 'DELETED' as ArticleStatus },
          }
        : {}),
      ...(exactSlug && search
        ? {
            slug: { equals: search },
            ...(excludeId ? { NOT: { id: excludeId } } : {}),
          }
        : search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      ...(status
        ? {
            status: status as ArticleStatus,
          }
        : {}),
    };

    // Build role-based visibility restrictions
    let where: Prisma.ArticleWhereInput = baseWhere;

    // If user is not a senior editor or admin, apply visibility restrictions
    if (!isAdminRole(user.role)) {
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              // User's own articles (any status)
              { userId: user.id },
              // Published articles from any author
              { status: 'PUBLISHED' },
            ],
          },
        ],
      };
    }

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
          previousStatus: true,
          deletedAt: true,
          heroImage: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              role: true,
            },
          },
          currentReviewer: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              role: true,
            },
          },
          games: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              genre: true,
            },
          },
          approvalHistory: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
            select: {
              id: true,
              fromStatus: true,
              toStatus: true,
              action: true,
              comment: true,
              createdAt: true,
              actionBy: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                },
              },
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
        pages: Math.max(1, Math.ceil(totalResults / limit)),
        page: totalResults === 0 ? 1 : page,
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
      slug,
      content,
      categoryId,
      status = 'DRAFT',
      publishedAt,
      gameIds = [],
      heroImage,
      userId = user.id,
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
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        userId,
        heroImage,
        slug: slug || generateSlug(title),
        games: {
          connect: gameIds.map(id => ({ id })),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        previousStatus: true,
        deletedAt: true,
        heroImage: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        },
        currentReviewer: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        },
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            genre: true,
          },
        },
        approvalHistory: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          select: {
            id: true,
            fromStatus: true,
            toStatus: true,
            action: true,
            comment: true,
            createdAt: true,
            actionBy: {
              select: {
                id: true,
                username: true,
                role: true,
              },
            },
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
