import { AnnouncementType, Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

import { GET, POST, PUT, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/jwt', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => {
  const mockAnnouncement = {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      adminAnnouncement: mockAnnouncement,
    },
  };
});

// Type for announcement with user
type AnnouncementMock = Prisma.AdminAnnouncementGetPayload<{
  select: {
    id: true;
    message: true;
    type: true;
    isActive: true;
    expiresAt: true;
    createdAt: true;
    createdBy: {
      select: {
        username: true;
      };
    };
  };
}>;

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const baseAnnouncement = {
  id: 'ann-1',
  message: 'Test Announcement',
  type: AnnouncementType.INFO,
  isActive: 'active',
  expiresAt: fixedDate,
  createdAt: fixedDate,
  createdBy: {
    username: 'testadmin',
  },
} satisfies AnnouncementMock;

// Mock users for testing
const mockSeniorEditor = {
  id: 'user-1',
  email: 'senior@test.com',
  username: 'senior',
  role: Role.SENIOR_EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

const mockEditor = {
  id: 'user-2',
  email: 'editor@test.com',
  username: 'editor',
  role: Role.EDITOR,
  isActive: true,
  lastPasswordChange: fixedDate.toISOString(),
  avatarUrl: null,
};

describe('GET /api/admin/announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all announcements for SENIOR_EDITOR+', async () => {
    const announcements = [
      baseAnnouncement,
      { ...baseAnnouncement, id: 'ann-2', message: 'Another Announcement' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(announcements);
    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);

    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
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
        isActive: 'active',
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
        createdBy: expect.objectContaining({
          username: expect.any(String),
        }),
      })
    );
    expect(findManyMock).toHaveBeenCalledWith({
      select: {
        id: true,
        message: true,
        type: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('should return 403 for insufficient role', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 403 for unauthenticated users', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(null);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle empty results', async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.findMany as any).mockImplementation(findManyMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching announcements');
  });
});

describe('POST /api/admin/announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    message: string,
    type: AnnouncementType,
    isActive = 'active',
    expiresAt?: string
  ): Request =>
    new Request('http://localhost/api/admin/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        type,
        isActive,
        expiresAt,
      }),
    });

  it('should create announcement with all fields', async () => {
    const newAnnouncement = {
      ...baseAnnouncement,
      message: 'New Announcement',
      createdById: mockSeniorEditor.id,
    };

    const createMock = vi.fn().mockResolvedValue(newAnnouncement);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.create as any).mockImplementation(createMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(
      'New Announcement',
      AnnouncementType.INFO,
      'active',
      fixedDate.toISOString()
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        message: 'New Announcement',
        type: AnnouncementType.INFO,
        isActive: 'active',
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
      })
    );
    expect(createMock).toHaveBeenCalledWith({
      data: {
        message: 'New Announcement',
        type: AnnouncementType.INFO,
        isActive: 'active',
        expiresAt: fixedDate,
        createdById: mockSeniorEditor.id,
      },
      select: expect.any(Object),
    });
  });

  it('should create announcement without expiration date', async () => {
    const newAnnouncement = {
      ...baseAnnouncement,
      message: 'New Announcement',
      expiresAt: null,
      createdById: mockSeniorEditor.id,
    };

    const createMock = vi.fn().mockResolvedValue(newAnnouncement);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.create as any).mockImplementation(createMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest('New Announcement', AnnouncementType.INFO);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.expiresAt).toBeNull();
  });

  it('should validate message is required', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest('', AnnouncementType.INFO);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message and valid type are required');
  });

  it('should validate type is required', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = new Request('http://localhost/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test', isActive: 'active' }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message and valid type are required');
  });

  it('should validate type is valid AnnouncementType', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = new Request('http://localhost/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test', type: 'INVALID_TYPE' }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message and valid type are required');
  });

  it('should validate isActive is valid', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = new Request('http://localhost/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test',
        type: AnnouncementType.INFO,
        isActive: 'invalid',
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('isActive must be "active" or "inactive"');
  });

  it('should return 403 for insufficient role', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest('Test', AnnouncementType.INFO);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const createMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.adminAnnouncement.create as any).mockImplementation(createMock);

    const request = createRequest('Test', AnnouncementType.INFO);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating announcement');
  });
});

describe('PUT /api/admin/announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    id: string,
    message: string,
    type: AnnouncementType,
    isActive: string,
    expiresAt?: string
  ): Request =>
    new Request('http://localhost/api/admin/announcements', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        message,
        type,
        isActive,
        expiresAt,
      }),
    });

  it('should update all announcement fields', async () => {
    const updatedAnnouncement = {
      ...baseAnnouncement,
      message: 'Updated Announcement',
      type: AnnouncementType.ATTENTION,
      isActive: 'inactive',
      expiresAt: new Date('2026-01-01'),
    };

    const updateMock = vi.fn().mockResolvedValue(updatedAnnouncement);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.update as any).mockImplementation(updateMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(
      'ann-1',
      'Updated Announcement',
      AnnouncementType.ATTENTION,
      'inactive',
      '2026-01-01T00:00:00.000Z'
    );
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: 'ann-1',
        message: 'Updated Announcement',
        type: AnnouncementType.ATTENTION,
        isActive: 'inactive',
        expiresAt: expect.any(String),
      })
    );
  });

  it('should update without changing expiration date', async () => {
    const updatedAnnouncement = {
      ...baseAnnouncement,
      message: 'Updated Announcement',
      expiresAt: null,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedAnnouncement);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.update as any).mockImplementation(updateMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(
      'ann-1',
      'Updated Announcement',
      AnnouncementType.INFO,
      'active'
    );
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.expiresAt).toBeNull();
  });

  it('should validate message is required', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest('ann-1', '', AnnouncementType.INFO, 'active');
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message and valid type are required');
  });

  it('should validate type is valid', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = new Request('http://localhost/api/admin/announcements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'ann-1',
        message: 'Test',
        type: 'INVALID_TYPE',
        isActive: 'active',
      }),
    });
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message and valid type are required');
  });

  it('should validate isActive is valid', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(
      'ann-1',
      'Test',
      AnnouncementType.INFO,
      'invalid'
    );
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('isActive must be "active" or "inactive"');
  });

  it('should return 403 for insufficient role', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const request = createRequest(
      'ann-1',
      'Test',
      AnnouncementType.INFO,
      'active'
    );
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const updateMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.adminAnnouncement.update as any).mockImplementation(updateMock);

    const request = createRequest(
      'ann-1',
      'Test',
      AnnouncementType.INFO,
      'active'
    );
    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating announcement');
  });
});

describe('DELETE /api/admin/announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete announcement', async () => {
    const deleteMock = vi.fn().mockResolvedValue(baseAnnouncement);
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);

    (prisma.adminAnnouncement.delete as any).mockImplementation(deleteMock);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await DELETE(
      new Request('http://localhost/api/admin/announcements?id=ann-1')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'ann-1' },
    });
  });

  it('should validate ID is required', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await DELETE(
      new Request('http://localhost/api/admin/announcements')
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Announcement ID is required');
  });

  it('should return 403 for insufficient role', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockEditor);
    (getCurrentUser as any).mockImplementation(getCurrentUserMock);

    const response = await DELETE(
      new Request('http://localhost/api/admin/announcements?id=ann-1')
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle database errors', async () => {
    const getCurrentUserMock = vi.fn().mockResolvedValue(mockSeniorEditor);
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));

    (getCurrentUser as any).mockImplementation(getCurrentUserMock);
    (prisma.adminAnnouncement.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(
      new Request('http://localhost/api/admin/announcements?id=ann-1')
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting announcement');
  });
});
