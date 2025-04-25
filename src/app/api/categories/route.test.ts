import { Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, POST } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockCategory = {
    findMany: vi.fn(),
    create: vi.fn(),
  };

  return {
    default: {
      category: mockCategory,
      $transaction: async (fn: any) =>
        Promise.resolve(fn({ category: mockCategory })),
    },
  };
});

// Type for full category with article count
type CategoryMock = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        articles: true;
      };
    };
  };
}>;

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

describe('GET /api/categories', () => {
  // Base category for testing
  const baseCategory = {
    id: 'cat-1',
    name: 'Test Category',
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: {
      articles: 0,
    },
  } satisfies CategoryMock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all categories ordered by name', async () => {
    const categories = [
      { ...baseCategory, name: 'Action' },
      { ...baseCategory, id: 'cat-2', name: 'Strategy' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(categories);
    (prisma.category.findMany as any).mockImplementation(findManyMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Action',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(new Date(data[0].createdAt)).toBeInstanceOf(Date);
    expect(new Date(data[0].updatedAt)).toBeInstanceOf(Date);
    expect(findManyMock).toHaveBeenCalledWith({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('should handle empty categories list', async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    (prisma.category.findMany as any).mockImplementation(findManyMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.category.findMany as any).mockImplementation(findManyMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching categories');
  });
});

describe('POST /api/categories', () => {
  // Mock users for auth testing
  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'admin',
    role: Role.ADMIN,
    isActive: true,
    lastPasswordChange: new Date().toISOString(),
    avatarUrl: null,
  };

  const mockEditor = {
    id: 'editor-1',
    email: 'editor@test.com',
    username: 'editor',
    role: Role.EDITOR,
    isActive: true,
    lastPasswordChange: new Date().toISOString(),
    avatarUrl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function for creating requests
  const createRequest = (name: string): Request =>
    new Request('http://localhost/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

  it('should allow admin to create category', async () => {
    const newCategory = {
      id: 'cat-1',
      name: 'Test Category',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const createMock = vi.fn().mockResolvedValue(newCategory);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('Test Category');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(new Date(data.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.updatedAt)).toBeInstanceOf(Date);
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: { name: 'Test Category' },
    });
  });

  it('should validate name is required', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const createMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name is required');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should return 403 for non-admin users', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    const createMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('Test Category');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should return 403 for unauthenticated requests', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    const createMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('Test Category');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const createMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('Test Category');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating category');
  });

  it('should allow SYSADMIN to create category', async () => {
    const newCategory = {
      id: 'cat-1',
      name: 'Test Category',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };

    const mockSysAdmin = {
      ...mockAdmin,
      role: Role.SYSADMIN,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSysAdmin);
    const createMock = vi.fn().mockResolvedValue(newCategory);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = createRequest('Test Category');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(new Date(data.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.updatedAt)).toBeInstanceOf(Date);
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: { name: 'Test Category' },
    });
  });

  it('should handle malformed JSON in request body', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const createMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = new Request('http://localhost/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating category');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should handle missing request body', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const createMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.create as any).mockImplementation(createMock);

    const request = new Request('http://localhost/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating category');
    expect(createMock).not.toHaveBeenCalled();
  });
});
