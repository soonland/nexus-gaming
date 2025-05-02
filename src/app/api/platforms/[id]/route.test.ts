import type { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';

import { GET, PATCH, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/prisma', () => {
  const mockPlatform = {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      platform: mockPlatform,
    },
  };
});

// Type for platform with games
type PlatformMock = Prisma.PlatformGetPayload<{
  select: {
    id: true;
    name: true;
    color: true;
    manufacturer: true;
    releaseDate: true;
    createdAt: true;
    updatedAt: true;
    games: {
      select: {
        id: true;
        title: true;
        coverImage: true;
        releaseDate: true;
      };
    };
  };
}>;

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const basePlatform = {
  id: 'plat-1',
  name: 'Test Platform',
  color: '#FF0000',
  manufacturer: 'Test Manufacturer',
  releaseDate: fixedDate,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  games: [
    {
      id: 'game-1',
      title: 'Game 1',
      coverImage: null,
      releaseDate: fixedDate,
    },
  ],
} satisfies PlatformMock;

describe('GET /api/platforms/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch platform with games', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(basePlatform);
    (prisma.platform.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Platform',
        color: '#FF0000',
        manufacturer: 'Test Manufacturer',
        releaseDate: fixedDate.toISOString(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        games: [
          expect.objectContaining({
            id: expect.any(String),
            title: 'Game 1',
            coverImage: null,
            releaseDate: expect.any(String),
          }),
        ],
      })
    );
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'plat-1' },
      select: {
        id: true,
        name: true,
        color: true,
        manufacturer: true,
        releaseDate: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            releaseDate: true,
          },
        },
      },
    });
  });

  it('should handle platform with no games', async () => {
    const platform = {
      ...basePlatform,
      games: [],
    };

    const findUniqueMock = vi.fn().mockResolvedValue(platform);
    (prisma.platform.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toEqual([]);
  });

  it('should handle null release dates', async () => {
    const platform = {
      ...basePlatform,
      releaseDate: null,
      games: [
        {
          ...basePlatform.games[0],
          releaseDate: null,
        },
      ],
    };

    const findUniqueMock = vi.fn().mockResolvedValue(platform);
    (prisma.platform.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.releaseDate).toBeNull();
    expect(data.games[0].releaseDate).toBeNull();
  });

  it('should return 404 for non-existent platform', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(null);
    (prisma.platform.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Platform not found');
  });

  it('should return 400 for missing id', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Platform ID is required');
  });

  it('should handle database errors', async () => {
    const findUniqueMock = vi
      .fn()
      .mockRejectedValue(new Error('Database error'));
    (prisma.platform.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching platform');
  });
});

describe('PATCH /api/platforms/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    name: string,
    manufacturer: string,
    releaseDate?: string
  ): Request =>
    new Request('http://localhost/api/platforms/plat-1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        manufacturer,
        releaseDate,
      }),
    });

  it('should update all platform fields', async () => {
    const updatedPlatform = {
      ...basePlatform,
      name: 'Updated Platform',
      manufacturer: 'Updated Manufacturer',
      releaseDate: new Date('2026-01-01'),
    };

    const updateMock = vi.fn().mockResolvedValue(updatedPlatform);
    (prisma.platform.update as any).mockImplementation(updateMock);

    const request = createRequest(
      'Updated Platform',
      'Updated Manufacturer',
      '2026-01-01T00:00:00.000Z'
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Updated Platform',
        manufacturer: 'Updated Manufacturer',
        releaseDate: '2026-01-01T00:00:00.000Z',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'plat-1' },
      data: {
        name: 'Updated Platform',
        manufacturer: 'Updated Manufacturer',
        releaseDate: new Date('2026-01-01T00:00:00.000Z'),
      },
      select: expect.any(Object),
    });
  });

  it('should update without release date', async () => {
    const updatedPlatform = {
      ...basePlatform,
      name: 'Updated Platform',
      manufacturer: 'Updated Manufacturer',
      releaseDate: null,
      games: [
        {
          ...basePlatform.games[0],
          releaseDate: null,
        },
      ],
    };

    const updateMock = vi.fn().mockResolvedValue(updatedPlatform);
    (prisma.platform.update as any).mockImplementation(updateMock);

    const request = createRequest('Updated Platform', 'Updated Manufacturer');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.releaseDate).toBeNull();
  });

  it('should validate name is required', async () => {
    const request = createRequest('', 'Updated Manufacturer');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name and manufacturer are required');

    const updateMock = vi.fn();
    (prisma.platform.update as any).mockImplementation(updateMock);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should validate manufacturer is required', async () => {
    const request = createRequest('Updated Platform', '');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name and manufacturer are required');

    const updateMock = vi.fn();
    (prisma.platform.update as any).mockImplementation(updateMock);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should return 400 for missing id', async () => {
    const request = createRequest('Updated Platform', 'Updated Manufacturer');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Platform ID is required');

    const updateMock = vi.fn();
    (prisma.platform.update as any).mockImplementation(updateMock);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should handle invalid date format', async () => {
    const request = createRequest(
      'Updated Platform',
      'Updated Manufacturer',
      'invalid-date'
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating platform');
  });

  it('should handle database errors', async () => {
    const updateMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.platform.update as any).mockImplementation(updateMock);

    const request = createRequest(
      'Updated Platform',
      'Updated Manufacturer',
      fixedDate.toISOString()
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating platform');
  });
});

describe('DELETE /api/platforms/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete platform successfully', async () => {
    const deleteMock = vi.fn().mockResolvedValue(basePlatform);
    (prisma.platform.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });

    expect(response.status).toBe(204);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'plat-1' },
    });
  });

  it('should return 400 for missing id', async () => {
    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: '' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Platform ID is required');

    const deleteMock = vi.fn();
    (prisma.platform.delete as any).mockImplementation(deleteMock);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should handle non-existent platform', async () => {
    const deleteMock = vi
      .fn()
      .mockRejectedValue(new Error('Record to delete does not exist'));
    (prisma.platform.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting platform');
  });

  it('should handle database errors', async () => {
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.platform.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'plat-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting platform');
  });
});
