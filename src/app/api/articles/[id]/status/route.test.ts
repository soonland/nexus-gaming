import { ApprovalAction, Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import type { ArticleStatus } from '@/types/api';
import type { AuthUser } from '@/types/auth';

import { PATCH } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockArticle = {
    findUnique: vi.fn(),
    update: vi.fn(),
  };

  const mockApprovalHistory = {
    create: vi.fn(),
  };

  return {
    default: {
      article: mockArticle,
      articleApprovalHistory: mockApprovalHistory,
      $transaction: async (fn: any) =>
        Promise.resolve(
          fn({
            article: mockArticle,
            articleApprovalHistory: mockApprovalHistory,
          })
        ),
    },
  };
});

type ArticleMock = Prisma.ArticleGetPayload<{
  include: {
    category: true;
    user: true;
    currentReviewer: true;
    games: true;
    approvalHistory: {
      include: {
        actionBy: true;
      };
    };
  };
}>;

describe('PATCH /api/articles/[id]/status', () => {
  const mockCategory = {
    id: 'cat-1',
    name: 'Test Category',
    color: '#FF0000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: Role.EDITOR,
    isActive: true,
    lastPasswordChange: new Date(),
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'hashed',
    avatarUrl: null,
  };

  const mockApprovalHistoryItem = {
    id: 'hist-1',
    articleId: '1',
    fromStatus: 'DRAFT' as ArticleStatus,
    toStatus: 'PENDING_APPROVAL' as ArticleStatus,
    action: ApprovalAction.SUBMITTED,
    comment: 'Initial submission',
    createdAt: new Date(),
    actionBy: mockUser,
    actionById: mockUser.id,
  };

  const baseArticle = {
    id: '1',
    title: 'Test Article',
    content: 'Content',
    status: 'DRAFT' as ArticleStatus,
    heroImage: null,
    publishedAt: null,
    userId: mockUser.id,
    categoryId: mockCategory.id,
    currentReviewerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategory,
    user: mockUser,
    currentReviewer: null,
    games: [],
    approvalHistory: [mockApprovalHistoryItem],
  } satisfies ArticleMock;

  const mockSeniorEditor: AuthUser = {
    id: 'editor-1',
    email: 'senior@test.com',
    username: 'senior_editor',
    role: Role.SENIOR_EDITOR,
    isActive: true,
    lastPasswordChange: new Date().toISOString(),
    avatarUrl: null,
  };

  const mockEditor: AuthUser = {
    id: 'editor-2',
    email: 'editor@test.com',
    username: 'editor',
    role: Role.EDITOR,
    isActive: true,
    lastPasswordChange: new Date().toISOString(),
    avatarUrl: null,
  };

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
      body: JSON.stringify({
        status,
        comment,
        reviewerId,
      }),
    }) as NextRequest;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow senior editor to publish directly from draft', async () => {
    const publishedArticle = {
      ...baseArticle,
      status: 'PUBLISHED' as ArticleStatus,
      publishedAt: new Date(),
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(publishedArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest('PUBLISHED', 'Direct publish from draft');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('PUBLISHED');
    expect(data.category.color).toBe('#FF0000');
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });

  it('should allow senior editor to request changes from pending approval', async () => {
    const pendingArticle = {
      ...baseArticle,
      status: 'PENDING_APPROVAL' as ArticleStatus,
    } satisfies ArticleMock;

    const changesNeededArticle = {
      ...pendingArticle,
      status: 'NEEDS_CHANGES' as ArticleStatus,
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(pendingArticle);
    const updateMock = vi.fn().mockResolvedValue(changesNeededArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest(
      'NEEDS_CHANGES',
      'Please revise the introduction'
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('NEEDS_CHANGES');
    expect(data.category.color).toBe('#FF0000');
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });

  it('should require comment when requesting changes', async () => {
    const pendingArticle = {
      ...baseArticle,
      status: 'PENDING_APPROVAL' as ArticleStatus,
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(pendingArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);

    const request = createRequest('NEEDS_CHANGES'); // No comment provided
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Comment is required when requesting changes');
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).not.toHaveBeenCalled(); // Should fail before DB query
  });

  it('should allow editor to submit article for review', async () => {
    const pendingArticle = {
      ...baseArticle,
      status: 'PENDING_APPROVAL' as ArticleStatus,
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(pendingArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest('PENDING_APPROVAL', 'Ready for review');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('PENDING_APPROVAL');
    expect(data.category.color).toBe('#FF0000');
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });

  it('should not allow editor to publish directly from draft', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);

    const request = createRequest('PUBLISHED', 'Try to publish');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain(
      'Invalid status transition or insufficient permissions'
    );
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });

  it('should allow senior editor to assign reviewer', async () => {
    const reviewerId = 'reviewer-1';
    const updatedArticle = {
      ...baseArticle,
      currentReviewerId: reviewerId,
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(updatedArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest(
      'PENDING_APPROVAL',
      'Assigned reviewer',
      reviewerId
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.currentReviewerId).toBe(reviewerId);
    expect(data.category.color).toBe('#FF0000');
  });

  it('should not allow editor to assign reviewer', async () => {
    const reviewerId = 'reviewer-1';
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);

    const request = createRequest(
      'PENDING_APPROVAL',
      'Try to assign reviewer',
      reviewerId
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized to assign reviewer');
  });

  it('should set publishedAt when publishing article', async () => {
    const publishedArticle = {
      ...baseArticle,
      status: 'PUBLISHED' as ArticleStatus,
      publishedAt: new Date(),
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(publishedArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest('PUBLISHED', 'Publishing article');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.publishedAt).toBeDefined();
    expect(data.category.color).toBe('#FF0000');
    expect(new Date(data.publishedAt)).toBeInstanceOf(Date);
  });

  it('should create approval history entry with correct action', async () => {
    const historyCreateMock = vi.fn().mockResolvedValue({});
    const articleUpdateMock = vi.fn().mockResolvedValue({
      ...baseArticle,
      status: 'PUBLISHED',
    });

    const mockTransaction = vi.fn().mockImplementation((fn: any) => {
      const tx = {
        article: {
          update: articleUpdateMock,
          findUnique: vi.fn(),
          findUniqueOrThrow: vi.fn(),
          findFirst: vi.fn(),
          findFirstOrThrow: vi.fn(),
        },
        articleApprovalHistory: {
          create: historyCreateMock,
          findUnique: vi.fn(),
          findUniqueOrThrow: vi.fn(),
          findFirst: vi.fn(),
          findFirstOrThrow: vi.fn(),
        },
      };
      return Promise.resolve(fn(tx));
    });

    vi.spyOn(prisma, '$transaction').mockImplementation(mockTransaction);

    (getCurrentUser as any).mockResolvedValue(mockSeniorEditor);
    (prisma.article.findUnique as any).mockResolvedValue(baseArticle);

    const request = createRequest('PUBLISHED', 'Publishing article');
    await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(historyCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: ApprovalAction.APPROVED,
          fromStatus: 'DRAFT',
          toStatus: 'PUBLISHED',
        }),
      })
    );
  });

  it('should include category data in response', async () => {
    const updatedArticle = {
      ...baseArticle,
      category: {
        ...mockCategory,
        color: '#00FF00', // Different color to test specific value
      },
    } satisfies ArticleMock;

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const findUniqueMock = vi.fn().mockResolvedValue(baseArticle);
    const updateMock = vi.fn().mockResolvedValue(updatedArticle);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.article.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.article.update as any).mockImplementation(updateMock);

    const request = createRequest('PENDING_APPROVAL', 'Testing category data');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBeDefined();
    expect(data.category.color).toBe('#00FF00');
    expect(data.category.name).toBe('Test Category');
  });
});
