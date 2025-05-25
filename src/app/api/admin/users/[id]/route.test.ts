import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, PATCH, PUT, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/password', () => ({
  hashPassword: vi
    .fn()
    .mockImplementation((pwd: string) => Promise.resolve(`hashed_${pwd}`)),
}));

vi.mock('@/lib/prisma', () => {
  const mockUser = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      user: mockUser,
    },
  };
});

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const createNextRequest = (url: string) =>
  new NextRequest(new URL(url), { method: 'GET' });

const createNextPutRequest = (
  userId: string,
  updates: {
    username?: string;
    email?: string;
    password?: string;
    role?: Role;
    isActive?: boolean;
  }
): NextRequest =>
  new NextRequest(new URL(`http://localhost/api/admin/users/${userId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

const createNextPatchRequest = (
  userId: string,
  updates: {
    isActive: boolean;
  }
): NextRequest =>
  new NextRequest(new URL(`http://localhost/api/admin/users/${userId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

const baseUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: Role.USER,
  isActive: true,
  lastPasswordChange: fixedDate,
  avatarUrl: null,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  _count: {
    articles: 0,
  },
};

describe('GET /api/admin/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 403 for unauthorized users', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 403 for non-admin users', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.USER,
    });
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should fetch user by id with article count', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.ADMIN,
    });
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toEqual({
      ...baseUser,
      lastPasswordChange: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(new Date(data.user.lastPasswordChange)).toBeInstanceOf(Date);
    expect(new Date(data.user.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.user.updatedAt)).toBeInstanceOf(Date);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastPasswordChange: true,
        _count: {
          select: { articles: true },
        },
      },
    });
  });

  it('should return 404 for non-existent user', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.ADMIN,
    });
    const findUniqueMock = vi.fn().mockResolvedValue(null);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(
      createNextRequest('http://localhost/api/admin/users/non-existent'),
      {
        params: Promise.resolve({ id: 'non-existent' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.ADMIN,
    });
    const findUniqueMock = vi
      .fn()
      .mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});

describe('PUT /api/admin/users/[id]', () => {
  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'admin',
    role: Role.ADMIN,
    isActive: true,
    lastPasswordChange: fixedDate.toISOString(),
    avatarUrl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate required fields', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createNextPutRequest('user-1', {
      username: '',
      email: '',
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'user-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should prevent duplicate username/email', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findFirstMock = vi.fn().mockResolvedValue({
      id: 'other-user',
      username: 'taken',
    });

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findFirst as any).mockImplementation(findFirstMock);

    const request = createNextPutRequest('user-1', {
      username: 'taken',
      email: 'test@example.com',
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'user-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username or email already exists');
  });

  it('should update with password change', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findFirstMock = vi.fn().mockResolvedValue(null);
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);
    const updateMock = vi.fn().mockResolvedValue({
      ...baseUser,
      username: 'updated',
      lastPasswordChange: new Date(),
    });

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findFirst as any).mockImplementation(findFirstMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.update as any).mockImplementation(updateMock);

    const request = createNextPutRequest('user-1', {
      username: 'updated',
      email: 'test@example.com',
      password: 'NewPassword123!',
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'user-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toEqual({
      ...baseUser,
      username: 'updated',
      email: 'test@example.com',
      lastPasswordChange: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(new Date(data.user.lastPasswordChange)).toBeInstanceOf(Date);
    expect(new Date(data.user.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.user.updatedAt)).toBeInstanceOf(Date);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        username: 'updated',
        password: 'hashed_NewPassword123!',
        lastPasswordChange: expect.any(Date),
      }),
      select: expect.any(Object),
    });
  });
});

describe('PATCH /api/admin/users/[id]', () => {
  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'admin',
    role: Role.ADMIN,
    isActive: true,
    lastPasswordChange: fixedDate.toISOString(),
    avatarUrl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle user status', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);
    const updateMock = vi.fn().mockResolvedValue({
      ...baseUser,
      isActive: false,
    });

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.update as any).mockImplementation(updateMock);

    const request = createNextPatchRequest('user-1', {
      isActive: false,
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'user-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toEqual({
      ...baseUser,
      isActive: false,
      lastPasswordChange: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(new Date(data.user.lastPasswordChange)).toBeInstanceOf(Date);
    expect(new Date(data.user.createdAt)).toBeInstanceOf(Date);
    expect(new Date(data.user.updatedAt)).toBeInstanceOf(Date);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isActive: false },
      select: expect.any(Object),
    });
  });

  it('should validate status value', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = new NextRequest(
      new URL('http://localhost/api/admin/users/user-1'),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: 'not-a-boolean' }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'user-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid status value');
  });

  it('should prevent self status change', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(mockAdmin);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);

    const request = createNextPatchRequest('admin-1', {
      isActive: false,
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'admin-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Cannot change your own status');
  });

  it('should prevent non-SYSADMIN from modifying SYSADMIN user', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.SYSADMIN,
    });

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);

    const request = createNextPatchRequest('sysadmin-1', {
      isActive: false,
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'sysadmin-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Only SYSADMIN users can modify SYSADMIN users');
  });
});

describe('DELETE /api/admin/users/[id]', () => {
  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'admin',
    role: Role.ADMIN,
    isActive: true,
    lastPasswordChange: fixedDate.toISOString(),
    avatarUrl: null,
  };

  const mockSysAdmin = {
    ...mockAdmin,
    role: Role.SYSADMIN,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow admin to delete user', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);
    const deleteMock = vi.fn().mockResolvedValue(baseUser);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('User deleted successfully');
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
  });

  it('should allow SYSADMIN to delete user', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSysAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);
    const deleteMock = vi.fn().mockResolvedValue(baseUser);

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('User deleted successfully');
  });

  it('should allow SYSADMIN to delete SYSADMIN', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSysAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.SYSADMIN,
    });
    const deleteMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.SYSADMIN,
    });

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/sysadmin-2'),
      {
        params: Promise.resolve({ id: 'sysadmin-2' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('User deleted successfully');
  });

  it('should prevent non-SYSADMIN from deleting SYSADMIN', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue({
      ...baseUser,
      role: Role.SYSADMIN,
    });
    const deleteMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/sysadmin-1'),
      {
        params: Promise.resolve({ id: 'sysadmin-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Only SYSADMIN users can delete SYSADMIN users');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should prevent self deletion', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(mockAdmin);
    const deleteMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/admin-1'),
      {
        params: Promise.resolve({ id: 'admin-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Cannot delete yourself');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should handle missing user', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(null);
    const deleteMock = vi.fn();

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/non-existent'),
      {
        params: Promise.resolve({ id: 'non-existent' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
    const findUniqueMock = vi.fn().mockResolvedValue(baseUser);
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.user.findUnique as any).mockImplementation(findUniqueMock);
    (prisma.user.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      createNextRequest('http://localhost/api/admin/users/user-1'),
      {
        params: Promise.resolve({ id: 'user-1' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
