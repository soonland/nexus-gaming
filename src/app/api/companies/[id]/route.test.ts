import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';

import { GET, PATCH, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/prisma', () => {
  const mockCompany = {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      company: mockCompany,
    },
  };
});

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const baseCompany = {
  id: 'comp-1',
  name: 'Test Company',
  isDeveloper: true,
  isPublisher: false,
  createdAt: fixedDate,
  updatedAt: fixedDate,
  gamesAsDev: [{ id: 'game-1', title: 'Game 1' }],
  gamesAsPub: [],
};

describe('GET /api/companies/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch company with games', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(baseCompany);
    (prisma.company.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Company',
        isDeveloper: true,
        isPublisher: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        gamesAsDev: [
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
          }),
        ],
        gamesAsPub: [],
      })
    );
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
      include: {
        gamesAsDev: {
          select: {
            id: true,
            title: true,
          },
        },
        gamesAsPub: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  });

  it('should return 404 for non-existent company', async () => {
    const findUniqueMock = vi.fn().mockResolvedValue(null);
    (prisma.company.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Company not found');
  });

  it('should return 400 for missing id', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Company ID is required');
  });

  it('should handle database errors', async () => {
    const findUniqueMock = vi
      .fn()
      .mockRejectedValue(new Error('Database error'));
    (prisma.company.findUnique as any).mockImplementation(findUniqueMock);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching company');
  });
});

describe('PATCH /api/companies/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    name: string,
    isDeveloper?: boolean,
    isPublisher?: boolean
  ): Request =>
    new Request('http://localhost/api/companies/comp-1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        isDeveloper,
        isPublisher,
      }),
    });

  it('should update company name', async () => {
    const updatedCompany = {
      ...baseCompany,
      name: 'Updated Company',
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCompany);
    (prisma.company.update as any).mockImplementation(updateMock);

    const request = createRequest('Updated Company');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Updated Company',
        isDeveloper: true,
        isPublisher: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
      data: {
        name: 'Updated Company',
        isDeveloper: false,
        isPublisher: false,
      },
    });
  });

  it('should update developer status', async () => {
    const updatedCompany = {
      ...baseCompany,
      isDeveloper: false,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCompany);
    (prisma.company.update as any).mockImplementation(updateMock);

    const request = createRequest('Test Company', false);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isDeveloper).toBe(false);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
      data: {
        name: 'Test Company',
        isDeveloper: false,
        isPublisher: false,
      },
    });
  });

  it('should update publisher status', async () => {
    const updatedCompany = {
      ...baseCompany,
      isPublisher: true,
    };

    const updateMock = vi.fn().mockResolvedValue(updatedCompany);
    (prisma.company.update as any).mockImplementation(updateMock);

    const request = createRequest('Test Company', undefined, true);
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isPublisher).toBe(true);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
      data: {
        name: 'Test Company',
        isDeveloper: false,
        isPublisher: true,
      },
    });
  });

  it('should validate name is required', async () => {
    const request = createRequest('');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name is required');

    const updateMock = vi.fn();
    (prisma.company.update as any).mockImplementation(updateMock);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should handle non-existent company', async () => {
    const updateMock = vi
      .fn()
      .mockRejectedValue(new Error('Record to update not found'));
    (prisma.company.update as any).mockImplementation(updateMock);

    const request = createRequest('Updated Company');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating company');
  });

  it('should handle database errors', async () => {
    const updateMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.company.update as any).mockImplementation(updateMock);

    const request = createRequest('Updated Company');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error updating company');
  });
});

describe('DELETE /api/companies/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete company successfully', async () => {
    const deleteMock = vi.fn().mockResolvedValue(baseCompany);
    (prisma.company.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'comp-1' }),
    });

    expect(response.status).toBe(204);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
    });
  });

  it('should return 500 for non-existent company', async () => {
    const deleteMock = vi
      .fn()
      .mockRejectedValue(new Error('Record to delete does not exist'));
    (prisma.company.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'non-existent' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting company');
  });

  it('should handle database errors', async () => {
    const deleteMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.company.delete as any).mockImplementation(deleteMock);

    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'comp-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error deleting company');
  });
});
