import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';
import type { IGameData } from '@/types/api';

import { GET, POST } from './route';

// Mock Prisma
vi.mock('@/lib/prisma', () => {
  const mockGame = {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
  };

  return {
    default: {
      game: mockGame,
      $transaction: async (fn: any) => Promise.resolve(fn({ game: mockGame })),
    },
  };
});

// Fixed date for consistent testing
const fixedDate = '2025-04-23T23:30:01.222Z';

// Base test data
const baseCompany = {
  id: 'company-1',
  name: 'Test Company',
  isDeveloper: true,
  isPublisher: true,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  _count: {
    gamesAsDev: 1,
    gamesAsPub: 1,
  },
};

const basePlatform = {
  id: 'platform-1',
  name: 'Test Platform',
  manufacturer: 'Test Manufacturer',
  releaseDate: fixedDate,
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const baseGame = {
  id: 'game-1',
  title: 'Test Game',
  description: 'Test Description',
  coverImage: 'https://test.com/image.jpg',
  releaseDate: fixedDate,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  developer: baseCompany,
  publisher: baseCompany,
  platforms: [basePlatform],
} satisfies Partial<IGameData>;

describe('GET /api/games', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all games with pagination', async () => {
    const games = [
      baseGame,
      { ...baseGame, id: 'game-2', title: 'Another Game' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(games);
    const countMock = vi.fn().mockResolvedValue(2);

    (prisma.game.findMany as any).mockImplementation(findManyMock);
    (prisma.game.count as any).mockImplementation(countMock);

    const url = new URL('http://localhost/api/games');
    const request = new Request(url);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      games,
      pagination: {
        total: 2,
        pages: 1,
        page: 1,
        limit: 10,
      },
    });

    expect(findManyMock).toHaveBeenCalledWith({
      where: expect.any(Object),
      skip: 0,
      take: 10,
      select: expect.any(Object),
      orderBy: { releaseDate: 'desc' },
    });
  });

  it('should handle search parameter', async () => {
    const games = [baseGame];
    const findManyMock = vi.fn().mockResolvedValue(games);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.game.findMany as any).mockImplementation(findManyMock);
    (prisma.game.count as any).mockImplementation(countMock);

    const url = new URL('http://localhost/api/games?search=test');
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              title: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
          ],
        },
      })
    );
  });

  it('should handle admin route with extended data', async () => {
    const games = [baseGame];
    const findManyMock = vi.fn().mockResolvedValue(games);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.game.findMany as any).mockImplementation(findManyMock);
    (prisma.game.count as any).mockImplementation(countMock);

    const url = new URL('http://localhost/api/games?admin=true');
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          developer: {
            select: expect.objectContaining({
              isDeveloper: true,
              isPublisher: true,
              _count: expect.any(Object),
            }),
          },
        }),
      })
    );
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.game.findMany as any).mockImplementation(findManyMock);

    const url = new URL('http://localhost/api/games');
    const request = new Request(url);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching games');
  });
});

describe('POST /api/games', () => {
  const validGameData = {
    title: 'New Game',
    description: 'Game Description',
    releaseDate: fixedDate,
    coverImage: 'https://test.com/image.jpg',
    platformIds: ['platform-1'],
    developerId: 'dev-1',
    publisherId: 'pub-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a game with valid data', async () => {
    const createMock = vi.fn().mockResolvedValue({
      ...baseGame,
      ...validGameData,
    });

    (prisma.game.create as any).mockImplementation(createMock);

    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validGameData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: validGameData.title,
        description: validGameData.description,
        releaseDate: expect.any(String),
      })
    );

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: validGameData.title,
        description: validGameData.description,
        developer: { connect: { id: validGameData.developerId } },
        publisher: { connect: { id: validGameData.publisherId } },
        platforms: {
          connect: validGameData.platformIds.map(id => ({ id })),
        },
      }),
      select: expect.any(Object),
    });
  });

  it('should handle database errors during creation', async () => {
    const createMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.game.create as any).mockImplementation(createMock);

    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validGameData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating game');
  });

  it('should handle malformed JSON in request body', async () => {
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating game');
  });
});
