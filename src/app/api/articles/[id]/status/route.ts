import type { ApprovalAction } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/jwt';
import { canTransitionToStatus, canAssignReviewer } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import type { ArticleStatus } from '@/types/api';

// Map status transitions to approval actions
const getApprovalAction = (
  fromStatus: ArticleStatus,
  toStatus: ArticleStatus
): ApprovalAction => {
  if (toStatus === 'PENDING_APPROVAL') return 'SUBMITTED';
  if (toStatus === 'PUBLISHED') return 'APPROVED';
  if (toStatus === 'NEEDS_CHANGES') return 'CHANGES_NEEDED';
  if (toStatus === 'ARCHIVED') return 'ARCHIVED';
  if (toStatus === 'DELETED') return 'DELETED';
  return 'SUBMITTED'; // Default for other transitions
};

// Validation schema for status update
const statusUpdateSchema = z
  .object({
    status: z.enum([
      'DRAFT',
      'PENDING_APPROVAL',
      'NEEDS_CHANGES',
      'PUBLISHED',
      'ARCHIVED',
      'DELETED',
    ]),
    comment: z.string().optional(),
    reviewerId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'NEEDS_CHANGES' && !data.comment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Comment is required when requesting changes',
        path: ['comment'],
      });
    }
  });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    const user = await getCurrentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const result = statusUpdateSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error.issues[0]?.message || 'Invalid request data',
        }),
        { status: 400 }
      );
    }

    const { status: newStatus, comment, reviewerId } = result.data;

    // Get current article
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        currentReviewer: true,
      },
    });

    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
      });
    }

    // Check status transition permission
    if (
      !canTransitionToStatus(
        article.status as ArticleStatus,
        newStatus as ArticleStatus,
        user.role
      )
    ) {
      return new Response(
        JSON.stringify({
          error: 'Invalid status transition or insufficient permissions',
        }),
        { status: 403 }
      );
    }

    // Check reviewer assignment permission if reviewerId is provided
    if (reviewerId && !canAssignReviewer(user.role)) {
      return new Response(
        JSON.stringify({ error: 'Not authorized to assign reviewer' }),
        { status: 403 }
      );
    }

    // Create transaction for status update and history
    const updatedArticle = await prisma.$transaction(async tx => {
      // Create history entry
      await tx.articleApprovalHistory.create({
        data: {
          articleId: article.id,
          fromStatus: article.status,
          toStatus: newStatus,
          action: getApprovalAction(
            article.status as ArticleStatus,
            newStatus as ArticleStatus
          ),
          comment: comment,
          actionById: user.id,
        },
      });

      // Update article
      return tx.article.update({
        where: { id: article.id },
        data: {
          status: newStatus,
          currentReviewerId: reviewerId,
          previousStatus: article.status,
          publishedAt:
            newStatus === 'PUBLISHED' ? new Date() : article.publishedAt,
          deletedAt: newStatus === 'DELETED' ? new Date() : article.deletedAt,
        },
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
          approvalHistory: {
            include: {
              actionBy: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          games: true,
        },
      });
    });

    return new Response(JSON.stringify(updatedArticle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating article status:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
