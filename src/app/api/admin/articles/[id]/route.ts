import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canSelectArticleAuthor } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import type { ArticleForm } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check for admin routes
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        categoryId: true,
        userId: true,
        heroImage: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true,
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
          },
        },
        approvalHistory: {
          orderBy: {
            createdAt: 'desc',
          },
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

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Error fetching article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check for admin routes
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = (await request.json()) as ArticleForm & { id: string };
    const {
      title,
      content,
      categoryId,
      status,
      publishedAt,
      gameIds = [],
      heroImage,
      userId,
    } = data;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      );
    }

    // Check if user has permission to change article author
    if (userId !== user.id && !canSelectArticleAuthor(user.role)) {
      return NextResponse.json(
        { error: 'Permission denied to change article author' },
        { status: 403 }
      );
    }

    // Get current article to validate permissions
    const currentArticle = await prisma.article.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!currentArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        heroImage,
        ...(userId && { userId }), // Only include userId if it's provided
        games: {
          set: gameIds.map(id => ({ id })),
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

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Error updating article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check for admin routes
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Error deleting article' },
      { status: 500 }
    );
  }
}
