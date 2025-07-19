import { AnnouncementType, Role } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockAnnouncement = {
    findMany: vi.fn(),
  };

  return {
    default: {
      adminAnnouncement: mockAnnouncement,
    },
  };
});

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const baseAnnouncement = {
  id: 'ann-1',
  message: 'Test Announcement',
  type: AnnouncementType.INFO,
  expiresAt: fixedDate,
  createdAt: fixedDate,
  isActive: 'active',
  visibility: 'PUBLIC',
};

// Mock users for testing
const mockEditor = {
  id: 'user-1',
  email: 'editor@test.com',
  username: 'editor',
  role: Role.EDITOR,
  isActive: true,
};

const mockUser = {
  id: 'user-2',
  email: 'user@test.com',
  username: 'user',
  role: Role.USER,
  isActive: true,
};

describe('GET /api/announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch active announcements for USER', async () => {
    const announcements = [
      baseAnnouncement,
      { ...baseAnnouncement, id: 'ann-2', message: 'Another Announcement' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(announcements);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockUser);

    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        message: 'Test Announcement',
        type: AnnouncementType.INFO,
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
      })
    );
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        isActive: 'active',
        visibility: 'PUBLIC',
        OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }],
      },
      select: {
        id: true,
        message: true,
        type: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('should handle empty results', async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);

    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return 403 for unauthenticated users', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);

    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching announcements');
  });
});
