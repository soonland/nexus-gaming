import { ApprovalAction, Role, ArticleStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import type { AuthUser } from '@/types/auth';

import { PATCH } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    article: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    articleApprovalHistory: {
      create: vi.fn(),
    },
    $transaction: vi.fn(fn => fn(prisma)),
  },
}));

// Fixed date for testing
const fixedDate = new Date('2025-05-01T12:00:00.000Z');

// Base test data
const baseCategory = {
  id: 'cat-1',
  name: 'Test Category',
  color: '#FF0000',
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const baseUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  role: Role.EDITOR,
  isActive: true,
  password: 'hashed',
  lastPasswordChange: fixedDate,
  lastLogin: null,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  avatarUrl: null,
};

const baseArticle = {
  id: '1',
  title: 'Test Article',
  content: 'Content',
  slug: 'test-article',
  status: ArticleStatus.DRAFT,
  heroImage: null,
  publishedAt: null,
  deletedAt: null,
  previousStatus: null,
  userId: baseUser.id,
  categoryId: baseCategory.id,
  currentReviewerId: null,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  category: baseCategory,
  user: baseUser,
  currentReviewer: null,
  games: [],
  approvalHistory: [],
};

// Auth user mocks
const mockSeniorEditor: AuthUser = {
  id: 'senior-1',
  username: 'senioreditor',
  email: 'senior@test.com',
  role: Role.SENIOR_EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

const mockEditor: AuthUser = {
  id: 'editor-1',
  username: 'editor',
  email: 'editor@test.com',
  role: Role.EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

// Helper functions
const createRequest = (
  status: ArticleStatus,
  comment?: string,
  reviewerId?: string
): NextRequest => {
  return new Request('http://localhost/api/articles/1/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, comment, reviewerId }),
  }) as NextRequest;
};

describe('PATCH /api/articles/[id]/status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(ArticleStatus.PUBLISHED);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Authentication required',
    });
  });

  it('should return 404 if article is not found', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockSeniorEditor);
    (prisma.article.findUnique as any).mockImplementation(null);

    const request = createRequest(ArticleStatus.PUBLISHED);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: 'Article not found',
    });
  });

  it('should handle database errors gracefully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockSeniorEditor);
    (prisma.article.findUnique as any).mockRejectedValue(
      new Error('Database error')
    );

    const request = createRequest(ArticleStatus.PUBLISHED);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Internal server error',
    });
  });

  it('should require comment when requesting changes', async () => {
    const mockArticle = {
      ...baseArticle,
      status: ArticleStatus.PENDING_APPROVAL,
    };

    vi.mocked(getCurrentUser).mockResolvedValue(mockSeniorEditor);
    (prisma.article.findUnique as any).mockResolvedValue(mockArticle);

    const request = createRequest(ArticleStatus.NEEDS_CHANGES);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Comment is required when requesting changes',
    });
  });

  it('should allow senior editor to publish directly from draft', async () => {
    const publishedArticle = {
      ...baseArticle,
      status: ArticleStatus.PUBLISHED,
      publishedAt: fixedDate,
    };

    const historyEntry = {
      id: 'hist-1',
      articleId: '1',
      fromStatus: ArticleStatus.DRAFT,
      toStatus: ArticleStatus.PUBLISHED,
      action: ApprovalAction.APPROVED,
      comment: null,
      createdAt: fixedDate,
      actionById: mockSeniorEditor.id,
    };

    vi.mocked(getCurrentUser).mockResolvedValue(mockSeniorEditor);
    (prisma.article.findUnique as any).mockResolvedValue(baseArticle);
    (prisma.article.update as any).mockResolvedValue(publishedArticle);
    (prisma.articleApprovalHistory.create as any).mockResolvedValue(
      historyEntry
    );

    const request = createRequest(
      ArticleStatus.PUBLISHED,
      'Publishing article'
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe(ArticleStatus.PUBLISHED);
    expect(data.publishedAt).toBe(fixedDate.toISOString());
    expect(new Date(data.publishedAt)).toBeInstanceOf(Date);
  });

  it('should not allow editor to publish directly from draft', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockEditor);
    (prisma.article.findUnique as any).mockResolvedValue(baseArticle);

    const request = createRequest(ArticleStatus.PUBLISHED);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: 'Invalid status transition or insufficient permissions',
    });
  });

  it('should allow editor to submit for review', async () => {
    const pendingArticle = {
      ...baseArticle,
      status: ArticleStatus.PENDING_APPROVAL,
    };

    const historyEntry = {
      id: 'hist-1',
      articleId: '1',
      fromStatus: ArticleStatus.DRAFT,
      toStatus: ArticleStatus.PENDING_APPROVAL,
      action: ApprovalAction.SUBMITTED,
      comment: 'Ready for review',
      createdAt: fixedDate,
      actionById: mockEditor.id,
    };

    vi.mocked(getCurrentUser).mockResolvedValue(mockEditor);
    (prisma.article.findUnique as any).mockResolvedValue(baseArticle);
    (prisma.article.update as any).mockResolvedValue(pendingArticle);
    (prisma.articleApprovalHistory.create as any).mockResolvedValue(
      historyEntry
    );

    const request = createRequest(
      ArticleStatus.PENDING_APPROVAL,
      'Ready for review'
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe(ArticleStatus.PENDING_APPROVAL);
  });

  it('should handle DELETED status appropriately', async () => {
    const deletedArticle = {
      ...baseArticle,
      status: ArticleStatus.DELETED,
      deletedAt: fixedDate,
    };

    const historyEntry = {
      id: 'hist-1',
      articleId: '1',
      fromStatus: ArticleStatus.DRAFT,
      toStatus: ArticleStatus.DELETED,
      action: ApprovalAction.DELETED,
      comment: 'Moving to trash',
      createdAt: fixedDate,
      actionById: mockSeniorEditor.id,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(deletedArticle);
    const createMock = vi.fn().mockResolvedValue(historyEntry);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockResolvedValue(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);
    (prisma.articleApprovalHistory.create as any).mockImplementation(
      createMock
    );
    const request = createRequest(ArticleStatus.DELETED, 'Moving to trash');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe(ArticleStatus.DELETED);
    expect(data.deletedAt).toBe(fixedDate.toISOString());
  });
});
