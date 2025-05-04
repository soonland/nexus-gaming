import { ApprovalAction, ArticleStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canDeleteArticles, canViewArticle } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import type { IArticleFormData, IArticleStatusUpdate } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canViewArticle(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    if ('status' in data && typeof data.status === 'string') {
      // Status update
      const statusData = data as IArticleStatusUpdate;

      // Validate that previousStatus is set when moving to trash
      if (
        statusData.status === ArticleStatus.DELETED &&
        !statusData.previousStatus
      ) {
        return NextResponse.json(
          { error: 'previousStatus is required when moving to trash' },
          { status: 400 }
        );
      }

      const article = await prisma.article.update({
        where: { id },
        data: {
          status: { set: statusData.status },
          previousStatus: {
            set:
              statusData.status === ArticleStatus.DELETED
                ? statusData.previousStatus
                : null,
          },
          deletedAt: {
            set:
              statusData.status === ArticleStatus.DELETED ? new Date() : null,
          },
          currentReviewerId: { set: statusData.reviewerId ?? null },
          approvalHistory: {
            create: {
              fromStatus: statusData.previousStatus || ArticleStatus.DRAFT,
              toStatus: statusData.status,
              action:
                statusData.status === ArticleStatus.DELETED
                  ? ApprovalAction.DELETED
                  : statusData.previousStatus === ArticleStatus.DELETED
                    ? ApprovalAction.RESTORED
                    : statusData.status === ArticleStatus.PUBLISHED
                      ? ApprovalAction.PUBLISHED
                      : statusData.status === ArticleStatus.ARCHIVED
                        ? ApprovalAction.ARCHIVED
                        : ApprovalAction.SUBMITTED,
              comment: statusData.comment || '',
              actionById: user.id,
            },
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
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

      return NextResponse.json(article);
    } else {
      // Regular article update
      const formData = data as IArticleFormData;

      const updateData = {
        title: { set: formData.title },
        slug: { set: formData.slug },
        content: { set: formData.content },
        status: formData.status ? { set: formData.status } : undefined,
        heroImage: { set: formData.heroImage },
        publishedAt: formData.publishedAt
          ? { set: new Date(formData.publishedAt) }
          : { set: undefined },
        updatedAt: formData.updatedAt
          ? { set: new Date(formData.updatedAt) }
          : { set: undefined },
        categoryId: { set: formData.categoryId },
        userId: { set: formData.userId },
        currentReviewerId: { set: formData.currentReviewerId || null },
        games: {
          set: formData.gameIds.map((id: string) => ({ id })),
        },
      };

      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          title: true,
          slug: true,
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

      return NextResponse.json(article);
    }
  } catch (error: any) {
    console.error('Error updating article:', error);
    if (error?.code) {
      console.error('Prisma error code:', error.code);
    }
    return NextResponse.json(
      { error: 'Error updating article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = (await request.json()) as IArticleStatusUpdate;

    // Validate that previousStatus is set when moving to trash
    if (data.status === ArticleStatus.DELETED && !data.previousStatus) {
      return NextResponse.json(
        { error: 'previousStatus is required when moving to trash' },
        { status: 400 }
      );
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        status: { set: data.status },
        previousStatus: {
          set:
            data.status === ArticleStatus.DELETED ? data.previousStatus : null,
        },
        deletedAt: {
          set: data.status === ArticleStatus.DELETED ? new Date() : null,
        },
        currentReviewerId: { set: data.reviewerId ?? null },
        approvalHistory: {
          create: {
            fromStatus: data.previousStatus || ArticleStatus.DRAFT,
            toStatus: data.status,
            action:
              data.status === ArticleStatus.DELETED
                ? ApprovalAction.DELETED
                : data.previousStatus === ArticleStatus.DELETED
                  ? ApprovalAction.RESTORED
                  : data.status === ArticleStatus.PUBLISHED
                    ? ApprovalAction.PUBLISHED
                    : data.status === ArticleStatus.ARCHIVED
                      ? ApprovalAction.ARCHIVED
                      : ApprovalAction.SUBMITTED,
            comment: data.comment || '',
            actionById: user.id,
          },
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Récupérer l'article pour vérifier les permissions
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Vérifier les permissions de suppression
    if (!canDeleteArticles(user.role, article, user.id)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this article' },
        { status: 403 }
      );
    }

    // Supprimer l'article
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
