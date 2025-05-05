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

/**
 * Mise à jour partielle d'un article (PATCH)
 */
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

    // Si c'est une mise à jour de statut
    if ('status' in data && typeof data.status === 'string') {
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
          status: statusData.status,
          previousStatus:
            statusData.status === ArticleStatus.DELETED
              ? statusData.previousStatus
              : null,
          deletedAt:
            statusData.status === ArticleStatus.DELETED ? new Date() : null,
          currentReviewerId: statusData.reviewerId ?? null,
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
      });

      return NextResponse.json(article);
    }

    // Sinon, c'est une mise à jour partielle des champs
    const partialData = data as Partial<IArticleFormData>;

    const updateData: any = {};

    // Ne mettre à jour que les champs fournis
    if (partialData.title) updateData.title = partialData.title;
    if (partialData.slug) updateData.slug = partialData.slug;
    if (partialData.content) updateData.content = partialData.content;
    if (partialData.heroImage !== undefined)
      updateData.heroImage = partialData.heroImage;
    if (partialData.status) updateData.status = partialData.status;
    if (partialData.categoryId) updateData.categoryId = partialData.categoryId;
    if (partialData.userId) updateData.userId = partialData.userId;
    if (partialData.currentReviewerId !== undefined)
      updateData.currentReviewerId = partialData.currentReviewerId;
    if (partialData.publishedAt !== undefined)
      updateData.publishedAt = partialData.publishedAt
        ? new Date(partialData.publishedAt)
        : null;
    if (partialData.updatedAt !== undefined)
      updateData.updatedAt = partialData.updatedAt
        ? new Date(partialData.updatedAt)
        : new Date();

    // Si les jeux sont fournis, mettre à jour la relation
    if (partialData.gameIds) {
      updateData.games = {
        disconnect: partialData.gameIds ? undefined : { id: undefined },
        connect: partialData.gameIds.map(id => ({ id })),
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
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
        games: true,
        approvalHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
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

/**
 * Mise à jour complète d'un article (PUT)
 */
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
    const formData = (await request.json()) as IArticleFormData;

    // Requiert tous les champs obligatoires
    if (!formData.title || !formData.content || !formData.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      status: formData.status,
      heroImage: formData.heroImage,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : null,
      updatedAt: formData.updatedAt ? new Date(formData.updatedAt) : new Date(),
      categoryId: formData.categoryId,
      userId: formData.userId,
      currentReviewerId: formData.currentReviewerId || null,
      // Remplacer complètement les jeux associés
      games: {
        set: [],
        connect: formData.gameIds?.map(id => ({ id })) || [],
      },
    };

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
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
        games: true,
        approvalHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
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
