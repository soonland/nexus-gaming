import { NotificationType, Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, POST } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockNotification = {
    findMany: vi.fn(),
    create: vi.fn(),
  };

  const mockPreference = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  };

  return {
    default: {
      systemNotification: mockNotification,
      notificationPreference: mockPreference,
    },
  };
});

// Fixed date for testing
const fixedDate = '2025-04-23T23:30:01.222Z';

// Base test data
const userId = 'user-1';
const mockUser = {
  id: userId,
  email: 'test@example.com',
  username: 'testuser',
  role: 'USER',
  isActive: true,
};

const baseNotification = {
  id: 'notification-1',
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

// Common Prisma query parts
const expirationFilter = {
  AND: [
    {
      OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }],
    },
  ],
};

const orderByClause = [{ isRead: 'asc' }, { createdAt: 'desc' }];

describe('GET /api/notifications', () => {
  let findMany: ReturnType<typeof vi.fn>;
  let findManyPrefs: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue(mockUser);

    findMany = vi.fn(() => Promise.resolve([baseNotification]));
    findManyPrefs = vi.fn(() =>
      Promise.resolve([
        {
          id: 'pref-1',
          type: NotificationType.SYSTEM_ALERT,
          inApp: true,
          email: false,
          userId,
        },
      ])
    );

    (prisma.systemNotification.findMany as any).mockImplementation(findMany);
    (prisma.notificationPreference.findMany as any).mockImplementation(
      findManyPrefs
    );
  });

  it('should return notifications filtered by type', async () => {
    const notification = {
      ...baseNotification,
      type: NotificationType.SYSTEM_ALERT,
    };
    findMany.mockResolvedValue([notification]);

    const request = new NextRequest(
      new URL('http://localhost/api/notifications?type=SYSTEM_ALERT')
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([notification]);
    expect(findMany).toHaveBeenCalledWith({
      where: {
        userId,
        type: NotificationType.SYSTEM_ALERT,
        ...expirationFilter,
      },
      orderBy: orderByClause,
      select: expect.any(Object),
    });
  });

  it('should validate notification type', async () => {
    const request = new NextRequest(
      new URL('http://localhost/api/notifications?type=INVALID')
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid notification type');
    expect(findMany).not.toHaveBeenCalled();
  });

  describe('notification preferences', () => {
    const preferences = [
      {
        id: 'pref-1',
        type: NotificationType.SYSTEM_ALERT,
        inApp: true,
        email: false,
        userId,
      },
      {
        id: 'pref-2',
        type: NotificationType.ARTICLE_REVIEW,
        inApp: false,
        email: true,
        userId,
      },
      {
        id: 'pref-3',
        type: NotificationType.MENTION,
        inApp: true,
        email: true,
        userId,
      },
    ];

    it('should only return notifications for enabled types', async () => {
      findManyPrefs.mockResolvedValue(preferences);

      const enabledNotifications = [
        {
          ...baseNotification,
          id: 'n1',
          type: NotificationType.SYSTEM_ALERT,
        },
        {
          ...baseNotification,
          id: 'n3',
          type: NotificationType.MENTION,
        },
      ];
      findMany.mockResolvedValue(enabledNotifications);

      const request = new NextRequest(
        new URL('http://localhost/api/notifications')
      );
      const response = await GET(request);
      const data = await response.json();

      expect(findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: {
            in: [NotificationType.SYSTEM_ALERT, NotificationType.MENTION],
          },
          ...expirationFilter,
        },
        orderBy: orderByClause,
        select: expect.any(Object),
      });

      expect(data.data).toEqual(enabledNotifications);
    });

    it('should return empty array when no preferences are enabled', async () => {
      findManyPrefs.mockResolvedValue(
        preferences.map(p => ({ ...p, inApp: false }))
      );

      const request = new NextRequest(
        new URL('http://localhost/api/notifications')
      );
      const response = await GET(request);
      const data = await response.json();

      expect(data.data).toEqual([]);
      expect(findMany).not.toHaveBeenCalled();
    });

    it('should ignore preferences when specific type is requested', async () => {
      findManyPrefs.mockResolvedValue(preferences);

      const notification = {
        ...baseNotification,
        type: NotificationType.ARTICLE_REVIEW,
      };
      findMany.mockResolvedValue([notification]);

      const request = new NextRequest(
        new URL('http://localhost/api/notifications?type=ARTICLE_REVIEW')
      );
      const response = await GET(request);
      const data = await response.json();

      expect(findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: NotificationType.ARTICLE_REVIEW,
          ...expirationFilter,
        },
        orderBy: orderByClause,
        select: expect.any(Object),
      });

      expect(data.data).toEqual([notification]);
    });
  });

  it('should require authentication', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const request = new NextRequest(
      new URL('http://localhost/api/notifications')
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(findMany).not.toHaveBeenCalled();
  });
});

describe('POST /api/notifications', () => {
  const validNotification = {
    type: NotificationType.SYSTEM_ALERT,
    level: 'info',
    title: 'Test Notification',
    message: 'This is a test notification',
    data: null,
    expiresAt: null,
  };

  let create: ReturnType<typeof vi.fn>;
  let findUnique: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue(mockUser);

    create = vi.fn().mockResolvedValue({
      ...baseNotification,
      ...validNotification,
    });
    findUnique = vi.fn().mockResolvedValue({
      id: 'pref-1',
      type: NotificationType.SYSTEM_ALERT,
      inApp: true,
      email: false,
      userId,
    });

    (prisma.systemNotification.create as any).mockImplementation(create);
    (prisma.notificationPreference.findUnique as any).mockImplementation(
      findUnique
    );
  });

  it('should create a notification with valid data', async () => {
    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validNotification),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith({
      data: {
        type: validNotification.type,
        level: validNotification.level,
        title: validNotification.title,
        message: validNotification.message,
        data: Prisma.JsonNull,
        expiresAt: null,
        userId,
      },
      select: {
        id: true,
        type: true,
        level: true,
        title: true,
        message: true,
        data: true,
        expiresAt: true,
        isRead: true,
        createdAt: true,
      },
    });
    expect(data.data).toEqual({ ...baseNotification, ...validNotification });
  });

  it('should validate notification type', async () => {
    const invalidNotification = {
      ...validNotification,
      type: 'INVALID',
    };

    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidNotification),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid notification type is required');
    expect(create).not.toHaveBeenCalled();
  });

  it('should respect notification preferences', async () => {
    findUnique.mockResolvedValue({
      id: 'pref-1',
      type: NotificationType.SYSTEM_ALERT,
      inApp: false,
      email: true,
      userId,
    });

    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validNotification),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.error).toBe(
      'Notification type is disabled by user preferences'
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('should require authentication', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validNotification),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(create).not.toHaveBeenCalled();
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create notification');
    expect(create).not.toHaveBeenCalled();
  });
});
