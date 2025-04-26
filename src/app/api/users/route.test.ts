import { Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, POST } from './route';

const createNextRequest = (url: string) =>
  new NextRequest(new URL(url), { method: 'GET' });

const createNextPostRequest = (userData: {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}): NextRequest =>
  new NextRequest(new URL('http://localhost/api/users'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

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
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
  };

  const mockNotification = {
    create: vi.fn(),
  };

  const mockPreference = {
    create: vi.fn(),
  };

  const mockDb = {
    user: mockUser,
    systemNotification: mockNotification,
    notificationPreference: mockPreference,
    $transaction: vi.fn(),
  };

  // Par défaut, $transaction exécute la fonction avec les mocks
  mockDb.$transaction.mockImplementation((fn: any) =>
    Promise.resolve(
      fn({
        user: mockUser,
        systemNotification: mockNotification,
        notificationPreference: mockPreference,
      })
    )
  );

  return {
    default: mockDb,
  };
});

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

// Base user data
const mockEditor = {
  id: 'editor-1',
  email: 'editor@test.com',
  username: 'editor',
  role: Role.EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

const mockSeniorEditor = {
  id: 'senior-editor-1',
  email: 'senior@test.com',
  username: 'senior',
  role: Role.SENIOR_EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

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
  id: 'sysadmin-1',
  email: 'sysadmin@test.com',
  username: 'sysadmin',
  role: Role.SYSADMIN,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

// Sample users for list testing
const sampleUsers = [
  {
    id: 'user-1',
    username: 'alice',
    email: 'alice@test.com',
    role: Role.USER,
    isActive: true,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: { articles: 0 },
  },
  {
    id: 'user-2',
    username: 'bob',
    email: 'bob@test.com',
    role: Role.EDITOR,
    isActive: true,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: { articles: 5 },
  },
  {
    id: 'user-3',
    username: 'charlie',
    email: 'charlie@test.com',
    role: Role.EDITOR,
    isActive: false,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: { articles: 3 },
  },
];

describe('User API Permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Réinitialiser le comportement par défaut de $transaction
    (prisma.$transaction as any).mockImplementation((fn: any) =>
      Promise.resolve(
        fn({
          user: prisma.user,
          systemNotification: prisma.systemNotification,
          notificationPreference: prisma.notificationPreference,
        })
      )
    );
  });

  describe('GET /api/users', () => {
    beforeEach(() => {
      const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
      (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    });

    it('should deny access to regular users', async () => {
      const getCurrentUserMock = vi.fn().mockResolvedValue({
        ...mockEditor,
        role: Role.USER,
      });
      (getCurrentUser as any).mockImplementation(getCurrentUserMock);

      const response = await GET(
        createNextRequest('http://localhost/api/users')
      );
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Unauthorized');
    });

    it('should allow SENIOR_EDITOR to list users', async () => {
      const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
      const findManyMock = vi.fn().mockResolvedValue([]);
      const countMock = vi.fn().mockResolvedValue(0);

      (getCurrentUser as any).mockImplementation(getCurrentUserMock);
      (prisma.user.findMany as any).mockImplementation(findManyMock);
      (prisma.user.count as any).mockImplementation(countMock);

      const response = await GET(
        createNextRequest('http://localhost/api/users')
      );

      expect(response.status).toBe(200);
    });

    describe('pagination', () => {
      it('should respect page and limit parameters', async () => {
        const findManyMock = vi.fn().mockResolvedValue(sampleUsers.slice(0, 2));
        const countMock = vi.fn().mockResolvedValue(sampleUsers.length);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?page=1&limit=2')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.users).toHaveLength(2);
        expect(data.pagination).toEqual({
          total: 3,
          pages: 2,
          page: 1,
          limit: 2,
        });
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 0,
            take: 2,
          })
        );
      });

      it('should handle invalid page numbers', async () => {
        const findManyMock = vi.fn().mockResolvedValue([]);
        const countMock = vi.fn().mockResolvedValue(sampleUsers.length);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?page=-1&limit=10')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.pagination.page).toBe(1); // Should default to 1
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 0, // Should not go below 0
            take: 10,
          })
        );
      });

      it('should handle invalid limit values', async () => {
        const findManyMock = vi.fn().mockResolvedValue(sampleUsers);
        const countMock = vi.fn().mockResolvedValue(sampleUsers.length);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?limit=1000')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.pagination.limit).toBeLessThanOrEqual(100); // Should be capped
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            take: 100,
          })
        );
      });
    });

    describe('search and filters', () => {
      it('should search by username', async () => {
        const findManyMock = vi
          .fn()
          .mockResolvedValue([sampleUsers.find(u => u.username === 'alice')]);
        const countMock = vi.fn().mockResolvedValue(1);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?search=alice')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.users).toHaveLength(1);
        expect(data.users[0].username).toBe('alice');
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              AND: [
                {
                  OR: [
                    {
                      username: { contains: 'alice', mode: 'insensitive' },
                    },
                    { email: { contains: 'alice', mode: 'insensitive' } },
                  ],
                },
                {},
                {},
              ],
            },
          })
        );
      });

      it('should filter by role', async () => {
        const editorUsers = sampleUsers.filter(u => u.role === Role.EDITOR);
        const findManyMock = vi.fn().mockResolvedValue(editorUsers);
        const countMock = vi.fn().mockResolvedValue(editorUsers.length);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?role=EDITOR')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.users).toHaveLength(2);
        expect(data.users.every((u: any) => u.role === 'EDITOR')).toBe(true);
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              AND: [{}, { role: 'EDITOR' }, {}],
            },
          })
        );
      });

      it('should filter by status', async () => {
        const activeUsers = sampleUsers.filter(u => u.isActive);
        const findManyMock = vi.fn().mockResolvedValue(activeUsers);
        const countMock = vi.fn().mockResolvedValue(activeUsers.length);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users?status=active')
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.users).toHaveLength(2);
        expect(data.users.every((u: any) => u.isActive)).toBe(true);
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              AND: [{}, {}, { isActive: true }],
            },
          })
        );
      });

      it('should combine search and filters', async () => {
        const findManyMock = vi.fn().mockResolvedValue([sampleUsers[1]]);
        const countMock = vi.fn().mockResolvedValue(1);

        (prisma.user.findMany as any).mockImplementation(findManyMock);
        (prisma.user.count as any).mockImplementation(countMock);

        const response = await GET(
          createNextRequest(
            'http://localhost/api/users?search=bob&role=EDITOR&status=active'
          )
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.users).toHaveLength(1);
        expect(data.users[0]).toEqual(
          expect.objectContaining({
            username: 'bob',
            role: 'EDITOR',
            isActive: true,
          })
        );
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              AND: [
                {
                  OR: [
                    {
                      username: { contains: 'bob', mode: 'insensitive' },
                    },
                    { email: { contains: 'bob', mode: 'insensitive' } },
                  ],
                },
                { role: 'EDITOR' },
                { isActive: true },
              ],
            },
          })
        );
      });
    });

    describe('error handling', () => {
      it('should handle database errors gracefully', async () => {
        const findManyMock = vi
          .fn()
          .mockRejectedValue(new Error('Database error'));
        (prisma.user.findMany as any).mockImplementation(findManyMock);

        const response = await GET(
          createNextRequest('http://localhost/api/users')
        );

        expect(response.status).toBe(500);
        expect(response.json()).resolves.toEqual({
          error: 'Internal server error',
        });
      });
    });
  });

  describe('POST /api/users', () => {
    describe('access control', () => {
      const testCases = [
        { role: Role.USER, title: 'regular user' },
        { role: Role.MODERATOR, title: 'moderator' },
      ];

      testCases.forEach(({ role, title }) => {
        it(`should deny access to ${title}`, async () => {
          const getCurrentUserMock = vi.fn().mockResolvedValue({
            ...mockEditor,
            role: role,
          });
          (getCurrentUser as any).mockImplementation(getCurrentUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'newuser',
            })
          );

          expect(response.status).toBe(403);
          expect(response.json()).resolves.toEqual({
            error: 'Unauthorized',
          });
        });
      });
    });

    describe('required fields validation', () => {
      const testCases = [
        {
          field: 'username',
          data: { email: 'test@test.com', password: 'Password123!' },
        },
        {
          field: 'email',
          data: { username: 'testuser', password: 'Password123!' },
        },
        {
          field: 'password',
          data: { username: 'testuser', email: 'test@test.com' },
        },
      ];

      beforeEach(() => {
        const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
        (getCurrentUser as any).mockImplementation(getCurrentUserMock);
      });

      testCases.forEach(({ field, data }) => {
        it(`should require ${field}`, async () => {
          const response = await POST(createNextPostRequest(data));

          expect(response.status).toBe(400);
          expect(response.json()).resolves.toEqual({
            error: 'Missing required fields',
          });
        });
      });
    });

    describe('role management', () => {
      describe('SENIOR_EDITOR permissions', () => {
        it('should allow creating USER', async () => {
          const getCurrentUserMock = vi
            .fn()
            .mockResolvedValue(mockSeniorEditor);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn().mockResolvedValue({
            role: Role.USER,
          });

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'newuser',
              role: Role.USER,
            })
          );

          expect(response.status).toBe(201);
        });

        it('should allow creating EDITOR', async () => {
          const getCurrentUserMock = vi
            .fn()
            .mockResolvedValue(mockSeniorEditor);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn().mockResolvedValue({
            role: Role.EDITOR,
          });

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'neweditor',
              role: Role.EDITOR,
            })
          );

          expect(response.status).toBe(201);
        });

        it('should prevent creating SENIOR_EDITOR', async () => {
          const getCurrentUserMock = vi
            .fn()
            .mockResolvedValue(mockSeniorEditor);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn();

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'newsenior',
              role: Role.SENIOR_EDITOR,
            })
          );

          expect(response.status).toBe(403);
          expect(createUserMock).not.toHaveBeenCalled();
        });
      });

      describe('ADMIN permissions', () => {
        it('should allow creating SENIOR_EDITOR', async () => {
          const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn().mockResolvedValue({
            role: Role.SENIOR_EDITOR,
          });

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'newsenior',
              role: Role.SENIOR_EDITOR,
            })
          );

          expect(response.status).toBe(201);
        });

        it('should prevent creating ADMIN', async () => {
          const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn();

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          const response = await POST(
            createNextPostRequest({
              email: 'new@example.com',
              password: 'Password123!',
              username: 'newadmin',
              role: Role.ADMIN,
            })
          );

          expect(response.status).toBe(403);
          expect(createUserMock).not.toHaveBeenCalled();
        });
      });

      describe('SYSADMIN permissions', () => {
        it('should allow creating any role including SYSADMIN', async () => {
          const getCurrentUserMock = vi.fn().mockResolvedValue(mockSysAdmin);
          const findFirstMock = vi.fn().mockResolvedValue(null);
          const createUserMock = vi.fn().mockResolvedValue({
            role: Role.SYSADMIN,
          });

          (getCurrentUser as any).mockImplementation(getCurrentUserMock);
          (prisma.user.findFirst as any).mockImplementation(findFirstMock);
          (prisma.user.create as any).mockImplementation(createUserMock);

          for (const role of Object.values(Role)) {
            const response = await POST(
              createNextPostRequest({
                email: 'new@example.com',
                password: 'Password123!',
                username: `new${role.toLowerCase()}`,
                role,
              })
            );

            expect(response.status).toBe(201);
          }
        });
      });
    });

    describe('Validation and error handling', () => {
      it('should validate email format', async () => {
        const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
        (getCurrentUser as any).mockImplementation(getCurrentUserMock);

        const response = await POST(
          createNextPostRequest({
            email: 'invalid-email',
            password: 'Password123!',
            username: 'newuser',
          })
        );

        expect(response.status).toBe(400);
        expect(response.json()).resolves.toEqual({
          error: 'Invalid email format',
        });
      });

      it('should prevent duplicate usernames', async () => {
        const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
        const findFirstMock = vi.fn().mockResolvedValue({ id: 'existing' });

        (getCurrentUser as any).mockImplementation(getCurrentUserMock);
        (prisma.user.findFirst as any).mockImplementation(findFirstMock);

        const response = await POST(
          createNextPostRequest({
            email: 'new@example.com',
            password: 'Password123!',
            username: 'existing',
          })
        );

        expect(response.status).toBe(400);
        expect(response.json()).resolves.toEqual({
          error: 'Username or email already exists',
        });
      });

      it('should handle transaction failures gracefully', async () => {
        const getCurrentUserMock = vi.fn().mockResolvedValue(mockAdmin);
        const findFirstMock = vi.fn().mockResolvedValue(null);
        (prisma.$transaction as any).mockRejectedValue(
          new Error('Transaction failed')
        );

        (getCurrentUser as any).mockImplementation(getCurrentUserMock);
        (prisma.user.findFirst as any).mockImplementation(findFirstMock);

        const response = await POST(
          createNextPostRequest({
            email: 'new@example.com',
            password: 'Password123!',
            username: 'newuser',
          })
        );

        expect(response.status).toBe(500);
        expect(response.json()).resolves.toEqual({
          error: 'Internal server error',
        });
      });
    });
  });
});
