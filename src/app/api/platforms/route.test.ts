import type { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';

import { GET, POST } from './route';

// Mock dependencies
vi.mock('@/lib/prisma', () => {
  const mockPlatform = {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
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
  games: [{ id: 'game-1', title: 'Game 1', coverImage: null }],
} satisfies PlatformMock;

describe('GET /api/platforms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch platforms with default pagination', async () => {
    const platforms = [
      basePlatform,
      { ...basePlatform, id: 'plat-2', name: 'Another Platform' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(platforms);
    const countMock = vi.fn().mockResolvedValue(2);

    (prisma.platform.findMany as any).mockImplementation(findManyMock);
    (prisma.platform.count as any).mockImplementation(countMock);

    const response = await GET(new Request('http://localhost/api/platforms'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.platforms).toHaveLength(2);
    expect(data.platforms[0]).toEqual(
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
            title: expect.any(String),
          }),
        ],
      })
    );
    expect(data.pagination).toEqual({
      total: 2,
      pages: 1,
      page: 1,
      limit: 10,
    });
    expect(findManyMock).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
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
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('should handle pagination parameters', async () => {
    const platforms = [basePlatform];
    const findManyMock = vi.fn().mockResolvedValue(platforms);
    const countMock = vi.fn().mockResolvedValue(15);

    (prisma.platform.findMany as any).mockImplementation(findManyMock);
    (prisma.platform.count as any).mockImplementation(countMock);

    const response = await GET(
      new Request('http://localhost/api/platforms?page=2&limit=5')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination).toEqual({
      total: 15,
      pages: 3,
      page: 2,
      limit: 5,
    });
    expect(findManyMock).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
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
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('should handle platforms without release date', async () => {
    const platform = {
      ...basePlatform,
      releaseDate: null,
    };
    const findManyMock = vi.fn().mockResolvedValue([platform]);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.platform.findMany as any).mockImplementation(findManyMock);
    (prisma.platform.count as any).mockImplementation(countMock);

    const response = await GET(new Request('http://localhost/api/platforms'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.platforms[0].releaseDate).toBeNull();
  });

  it('should handle empty results', async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    const countMock = vi.fn().mockResolvedValue(0);

    (prisma.platform.findMany as any).mockImplementation(findManyMock);
    (prisma.platform.count as any).mockImplementation(countMock);

    const response = await GET(new Request('http://localhost/api/platforms'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.platforms).toEqual([]);
    expect(data.pagination).toEqual({
      total: 0,
      pages: 0,
      page: 1,
      limit: 10,
    });
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.platform.findMany as any).mockImplementation(findManyMock);

    const response = await GET(new Request('http://localhost/api/platforms'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching platforms');
  });
});

describe('POST /api/platforms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function for creating requests
  const createRequest = (
    name: string,
    manufacturer: string,
    color?: string,
    releaseDate?: string
  ): Request =>
    new Request('http://localhost/api/platforms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        manufacturer,
        color: color ?? undefined,
        releaseDate: releaseDate ?? undefined,
      }),
    });

  it('should create platform with all fields', async () => {
    const newPlatform = {
      ...basePlatform,
      name: 'New Platform',
      manufacturer: 'New Manufacturer',
      color: '#FF0000',
      releaseDate: fixedDate,
      games: [],
    };

    const createMock = vi.fn().mockResolvedValue(newPlatform);
    (prisma.platform.create as any).mockImplementation(createMock);

    const request = createRequest(
      'New Platform',
      'New Manufacturer',
      '#FF0000',
      fixedDate.toISOString()
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'New Platform',
        color: '#FF0000',
        manufacturer: 'New Manufacturer',
        releaseDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: 'New Platform',
        color: '#FF0000',
        manufacturer: 'New Manufacturer',
        releaseDate: fixedDate,
      },
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
          },
        },
      },
    });
  });

  it('should create platform without release date', async () => {
    const newPlatform = {
      ...basePlatform,
      name: 'New Platform',
      color: null,
      manufacturer: 'New Manufacturer',
      releaseDate: null,
      games: [],
    };

    const createMock = vi.fn().mockResolvedValue(newPlatform);
    (prisma.platform.create as any).mockImplementation(createMock);

    const request = createRequest('New Platform', 'New Manufacturer');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.releaseDate).toBeNull();
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: 'New Platform',
        manufacturer: 'New Manufacturer',
        color: undefined,
        releaseDate: null,
      },
      select: expect.any(Object),
    });
  });

  it('should validate name is required', async () => {
    const request = createRequest('', 'New Manufacturer');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name and manufacturer are required');

    const createMock = vi.fn();
    (prisma.platform.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should validate manufacturer is required', async () => {
    const request = createRequest('New Platform', '');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name and manufacturer are required');

    const createMock = vi.fn();
    (prisma.platform.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should handle malformed date', async () => {
    const request = createRequest(
      'New Platform',
      'New Manufacturer',
      '#FF0000',
      'invalid-date'
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating platform');

    const createMock = vi.fn();
    (prisma.platform.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const createMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.platform.create as any).mockImplementation(createMock);

    const request = createRequest(
      'New Platform',
      'New Manufacturer',
      '#FF0000'
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating platform');
  });

  it('should handle malformed JSON', async () => {
    const request = new Request('http://localhost/api/platforms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating platform');

    const createMock = vi.fn();
    (prisma.platform.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });
});
