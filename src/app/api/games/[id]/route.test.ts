import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';

import { DELETE, GET, PATCH } from './route';

// Mock Prisma
vi.mock('@/lib/prisma', () => {
  const mockGame = {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      game: mockGame,
    },
  };
});

// Fixed date for consistent testing
const fixedDate = '2025-04-23T23:30:01.222Z';

// Base test data
const gameId = 'game-1';
const baseGame = {
  id: gameId,
  title: 'Test Game',
  description: 'Test Description',
  coverImage: 'https://test.com/image.jpg',
  releaseDate: fixedDate,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  developer: {
    id: 'company-1',
    name: 'Test Developer',
    isDeveloper: true,
    isPublisher: true,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: {
      gamesAsDev: 1,
      gamesAsPub: 1,
    },
  },
  publisher: {
    id: 'company-1',
    name: 'Test Publisher',
    isDeveloper: true,
    isPublisher: true,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    _count: {
      gamesAsDev: 1,
      gamesAsPub: 1,
    },
  },
  platforms: [
    {
      id: 'platform-1',
      name: 'Test Platform',
      manufacturer: 'Test Manufacturer',
      releaseDate: fixedDate,
    },
  ],
  articles: [],
};

describe('GET /api/games/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a single game by id', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(baseGame);
    (prisma.game.findUnique as any).mockImplementation(findUniqueMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`)
    );
    const params = Promise.resolve({ id: gameId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: gameId,
        title: baseGame.title,
        description: baseGame.description,
      })
    );

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: gameId },
      select: expect.any(Object),
    });
  });

  it('should return 404 when game is not found', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(null);
    (prisma.game.findUnique as any).mockImplementation(findUniqueMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`)
    );
    const params = Promise.resolve({ id: gameId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Game not found');
  });

  it('should handle database errors', async () => {
    const findUniqueMock = vi
      .fn()
      .mockRejectedValue(new Error('Database error'));
    (prisma.game.findUnique as any).mockImplementation(findUniqueMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`)
    );
    const params = Promise.resolve({ id: gameId });
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching game');
  });
});

describe('PATCH /api/games/[id]', () => {
  const updateData = {
    title: 'Updated Game',
    description: 'Updated Description',
    platformIds: ['platform-2'],
    developerId: 'dev-2',
    publisherId: 'pub-2',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a game with valid data', async () => {
    const updatedGame = {
      ...baseGame,
      ...updateData,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedGame);
    (prisma.game.update as any).mockImplementation(updateMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    const params = Promise.resolve({ id: gameId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: gameId,
        title: updateData.title,
        description: updateData.description,
      })
    );

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: gameId },
      data: expect.objectContaining({
        title: updateData.title,
        description: updateData.description,
        developer: {
          connect: { id: updateData.developerId },
        },
        platforms: {
          connect: updateData.platformIds.map(id => ({ id })),
        },
      }),
      select: expect.any(Object),
    });
  });

  it('should handle database errors during update', async () => {
    const updateMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.game.update as any).mockImplementation(updateMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    const params = Promise.resolve({ id: gameId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating game');
  });

  it('should handle malformed JSON in request body', async () => {
    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      }
    );

    const params = Promise.resolve({ id: gameId });
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating game');
  });
});

describe('DELETE /api/games/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a game successfully', async () => {
    const deleteMock = vi.fn().mockResolvedValue(baseGame);
    (prisma.game.delete as any).mockImplementation(deleteMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`),
      {
        method: 'DELETE',
      }
    );

    const params = Promise.resolve({ id: gameId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(204);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: gameId },
    });
  });

  it('should handle database errors during deletion', async () => {
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.game.delete as any).mockImplementation(deleteMock);

    const request = new NextRequest(
      new URL(`http://localhost/api/games/${gameId}`),
      {
        method: 'DELETE',
      }
    );

    const params = Promise.resolve({ id: gameId });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting game');
  });
});
