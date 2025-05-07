import { Role } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, PATCH, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockCategory = {
    findUnique: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      category: mockCategory,
    },
  };
});

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const baseCategory = {
  id: 'cat-1',
  name: 'Test Category',
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

describe('GET /api/categories/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch category by id', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue({
      ...baseCategory,
      parent: null,
    });
    (prisma.category.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 'cat-1',
      name: 'Test Category',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      parent: null,
    });
    expect(new Date(data.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.updatedAt)).toBeInstanceOf(Date);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });

  it('should return 404 for non-existent category', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(null);
    (prisma.category.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Category not found');
  });

  it('should return 400 for missing id', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Category ID is required');
  });

  it('should handle database errors', async () => {
    const findUniqueMock = vi
      .fn()
      .mockRejectedValue(new Error('Database error'));
    (prisma.category.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching category');
  });
});

describe('PATCH /api/categories/[id]', () => {
  const createRequest = (data: {
    name?: string;
    color?: string;
    isDefault?: boolean;
    parentId?: string;
    description?: string;
  }): Request =>
    new Request('http://localhost/api/categories/cat-1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

  // Mock user for auth testing
  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'admin',
    role: Role.ADMIN,
    isActive: true,
    lastPasswordChange: new Date().toISOString(),
    avatarUrl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
  });

  it('should update category name', async () => {
    const updatedCategory = {
      ...baseCategory,
      name: 'Updated Category',
      parent: null,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCategory);
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({ name: 'Updated Category' });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Updated Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        parent: null,
      })
    );
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: { name: 'Updated Category' },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });

  it('should validate name is required', async () => {
    const updateMock = vi.fn();
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({ name: '' });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name is required');
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should validate color format', async () => {
    const updateMock = vi.fn();
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({
      name: 'Updated Category',
      color: 'invalid',
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid color format');
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should allow valid color format', async () => {
    const updatedCategory = {
      ...baseCategory,
      name: 'Updated Category',
      color: '#FF0000',
      parent: null,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCategory);
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({
      name: 'Updated Category',
      color: '#FF0000',
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        color: '#FF0000',
      })
    );
  });

  it('should handle default category logic', async () => {
    const updatedCategory = {
      ...baseCategory,
      name: 'Default Category',
      isDefault: true,
      parent: null,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCategory);
    const updateManyMock = vi.fn().mockResolvedValue({ count: 1 });
    (prisma.category.update as any).mockImplementation(updateMock);
    (prisma.category.updateMany as any).mockImplementation(updateManyMock);

    const request = createRequest({
      name: 'Default Category',
      isDefault: true,
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isDefault).toBe(true);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: expect.objectContaining({
        name: 'Default Category',
        isDefault: true,
      }),
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });

  it('should require admin authorization', async () => {
    const mockEditor = {
      id: 'editor-1',
      email: 'editor@test.com',
      username: 'editor',
      role: Role.EDITOR,
      isActive: true,
      lastPasswordChange: new Date().toISOString(),
      avatarUrl: null,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const updateMock = vi.fn();
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({ name: 'Updated Category' });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized');
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const updateMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.category.update as any).mockImplementation(updateMock);

    const request = createRequest({ name: 'Updated Category' });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating category');
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: { name: 'Updated Category' },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });
});

describe('DELETE /api/categories/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow admin to delete category', async () => {
    const mockAdmin = {
      id: 'admin-1',
      email: 'admin@test.com',
      username: 'admin',
      role: Role.ADMIN,
      isActive: true,
      lastPasswordChange: new Date().toISOString(),
      avatarUrl: null,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const deleteMock = vi.fn().mockResolvedValue(baseCategory);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });

    expect(response.status).toBe(204);
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
    });
  });

  it('should allow SYSADMIN to delete category', async () => {
    const mockSysAdmin = {
      id: 'admin-1',
      email: 'admin@test.com',
      username: 'admin',
      role: Role.SYSADMIN,
      isActive: true,
      lastPasswordChange: new Date().toISOString(),
      avatarUrl: null,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSysAdmin);
    const deleteMock = vi.fn().mockResolvedValue(baseCategory);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });

    expect(response.status).toBe(204);
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
    });
  });

  it('should return 403 for non-admin users', async () => {
    const mockEditor = {
      id: 'editor-1',
      email: 'editor@test.com',
      username: 'editor',
      role: Role.EDITOR,
      isActive: true,
      lastPasswordChange: new Date().toISOString(),
      avatarUrl: null,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    const deleteMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should return 403 for unauthenticated requests', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    const deleteMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Not authorized');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const mockAdmin = {
      id: 'admin-1',
      email: 'admin@test.com',
      username: 'admin',
      role: Role.ADMIN,
      isActive: true,
      lastPasswordChange: new Date().toISOString(),
      avatarUrl: null,
    };

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.category.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'cat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting category');
  });
});
