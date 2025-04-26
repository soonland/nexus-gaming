import { NotificationType } from '@prisma/client';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { DELETE, GET, PATCH } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockNotification = {
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      systemNotification: mockNotification,
    },
  };
});

// Fixed date for testing
const fixedDate = '2025-04-23T23:30:01.222Z';

// Base test data
const userId = 'user-1';
const notificationId = 'notification-1';
const mockUser = {
  id: userId,
  email: 'test@example.com',
  username: 'testuser',
  role: 'USER',
  isActive: true,
};

const baseNotification = {
  id: notificationId,
  type: NotificationType.SYSTEM_ALERT,
  level: 'info',
  title: 'Test Notification',
  message: 'This is a test notification',
  isRead: false,
  data: null,
  expiresAt: null,
  createdAt: fixedDate,
  userId,
};

describe('GET /api/notifications/[id]', () => {
  let findFirst: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue(mockUser);

    findFirst = vi.fn(() => Promise.resolve(baseNotification));
    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);
  });

  it('should fetch a single notification', async () => {
    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`)
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(
      expect.objectContaining({
        id: notificationId,
        type: NotificationType.SYSTEM_ALERT,
      })
    );

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: notificationId,
        userId,
      },
      select: expect.any(Object),
    });
  });

  it('should return 404 when notification is not found', async () => {
    findFirst = vi.fn(() => Promise.resolve(null));
    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`)
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Notification not found');
  });

  it('should require authentication', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`)
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('PATCH /api/notifications/[id]', () => {
  let findFirst: ReturnType<typeof vi.fn>;
  let update: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue(mockUser);

    findFirst = vi.fn(() => Promise.resolve(baseNotification));
    update = vi.fn(() =>
      Promise.resolve({
        ...baseNotification,
        isRead: true,
        title: 'Updated Title',
      })
    );

    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);
    (prisma.systemNotification.update as any).mockImplementation(update);
  });

  it('should update a notification', async () => {
    const updateData = {
      isRead: true,
      title: 'Updated Title',
      message: 'Updated message',
      level: 'warning' as const,
    };

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    const params = Promise.resolve({ id: notificationId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(
      expect.objectContaining({
        id: notificationId,
        isRead: true,
        title: 'Updated Title',
      })
    );

    expect(update).toHaveBeenCalledWith({
      where: { id: notificationId },
      data: expect.objectContaining({
        isRead: true,
        title: 'Updated Title',
      }),
      select: expect.any(Object),
    });
  });

  it('should validate update data', async () => {
    const invalidData = {
      level: 'invalid',
      title: '',
    };

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toContain('Invalid notification level');
    expect(data.details).toContain(
      'Title must be between 1 and 255 characters'
    );
  });

  it('should return 404 when notification is not found', async () => {
    findFirst = vi.fn(() => Promise.resolve(null));
    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Notification not found');
  });
});

describe('DELETE /api/notifications/[id]', () => {
  let findFirst: ReturnType<typeof vi.fn>;
  let deleteNotification: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue(mockUser);

    findFirst = vi.fn(() => Promise.resolve(baseNotification));
    deleteNotification = vi.fn(() => Promise.resolve(baseNotification));

    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);
    (prisma.systemNotification.delete as any).mockImplementation(
      deleteNotification
    );
  });

  it('should delete a notification', async () => {
    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'DELETE',
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(204);
    expect(deleteNotification).toHaveBeenCalledWith({
      where: { id: notificationId },
    });
  });

  it('should return 404 when notification is not found', async () => {
    findFirst = vi.fn(() => Promise.resolve(null));
    (prisma.systemNotification.findFirst as any).mockImplementation(findFirst);

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'DELETE',
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Notification not found');
  });

  it('should require authentication', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'DELETE',
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle database errors', async () => {
    deleteNotification = vi.fn(() =>
      Promise.reject(new Error('Database error'))
    );
    (prisma.systemNotification.delete as any).mockImplementation(
      deleteNotification
    );

    const request = new NextRequest(
      new URL(`http://localhost/api/notifications/${notificationId}`),
      {
        method: 'DELETE',
      }
    );
    const params = Promise.resolve({ id: notificationId });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete notification');
  });
});
