import type { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';

import { GET, POST } from './route';

// Mock dependencies
vi.mock('@/lib/prisma', () => {
  const mockCompany = {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
  };

  return {
    default: {
      company: mockCompany,
    },
  };
});

// Type for company with all fields
type CompanyMock = Prisma.CompanyGetPayload<{
  select: {
    id: true;
    name: true;
    isDeveloper: true;
    isPublisher: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

// Fixed date for consistent testing
const fixedDate = new Date('2025-04-23T23:30:01.222Z');

const baseCompany = {
  id: 'comp-1',
  name: 'Test Company',
  isDeveloper: true,
  isPublisher: false,
  createdAt: fixedDate,
  updatedAt: fixedDate,
} satisfies CompanyMock;

describe('GET /api/companies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch companies with default pagination', async () => {
    const companies = [
      baseCompany,
      { ...baseCompany, id: 'comp-2', name: 'Another Company' },
    ];

    const findManyMock = vi.fn().mockResolvedValue(companies);
    const countMock = vi.fn().mockResolvedValue(2);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(new Request('http://localhost/api/companies'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.companies).toHaveLength(2);
    expect(data.companies[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Company',
        isDeveloper: true,
        isPublisher: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(data.pagination).toEqual({
      total: 2,
      pages: 1,
      page: 1,
      limit: 10,
    });
    expect(findManyMock).toHaveBeenCalledWith({
      where: { AND: [{}, {}, {}] },
      skip: 0,
      take: 10,
      orderBy: { name: 'asc' },
    });
  });

  it('should handle search parameter', async () => {
    const companies = [baseCompany];
    const findManyMock = vi.fn().mockResolvedValue(companies);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(
      new Request('http://localhost/api/companies?search=Test')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.companies).toHaveLength(1);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        AND: [
          {
            name: {
              contains: 'Test',
              mode: 'insensitive',
            },
          },
          {},
          {},
        ],
      },
      skip: 0,
      take: 10,
      orderBy: { name: 'asc' },
    });
  });

  it('should filter by developer role', async () => {
    const companies = [baseCompany];
    const findManyMock = vi.fn().mockResolvedValue(companies);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(
      new Request('http://localhost/api/companies?role=developer')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.companies).toHaveLength(1);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        AND: [{}, { isDeveloper: true }, {}],
      },
      skip: 0,
      take: 10,
      orderBy: { name: 'asc' },
    });
  });

  it('should filter by publisher role', async () => {
    const companies = [baseCompany];
    const findManyMock = vi.fn().mockResolvedValue(companies);
    const countMock = vi.fn().mockResolvedValue(1);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(
      new Request('http://localhost/api/companies?role=publisher')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.companies).toHaveLength(1);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        AND: [{}, {}, { isPublisher: true }],
      },
      skip: 0,
      take: 10,
      orderBy: { name: 'asc' },
    });
  });

  it('should handle pagination parameters', async () => {
    const companies = [baseCompany];
    const findManyMock = vi.fn().mockResolvedValue(companies);
    const countMock = vi.fn().mockResolvedValue(15);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(
      new Request('http://localhost/api/companies?page=2&limit=5')
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
      where: { AND: [{}, {}, {}] },
      skip: 5,
      take: 5,
      orderBy: { name: 'asc' },
    });
  });

  it('should handle empty results', async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    const countMock = vi.fn().mockResolvedValue(0);

    (prisma.company.findMany as any).mockImplementation(findManyMock);
    (prisma.company.count as any).mockImplementation(countMock);

    const response = await GET(new Request('http://localhost/api/companies'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.companies).toEqual([]);
    expect(data.pagination).toEqual({
      total: 0,
      pages: 0,
      page: 1,
      limit: 10,
    });
  });

  it('should handle database errors', async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.company.findMany as any).mockImplementation(findManyMock);

    const response = await GET(new Request('http://localhost/api/companies'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error fetching companies');
  });
});

describe('POST /api/companies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    name: string,
    isDeveloper: boolean,
    isPublisher: boolean
  ): Request =>
    new Request('http://localhost/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, isDeveloper, isPublisher }),
    });

  it('should create developer company', async () => {
    const newCompany = {
      ...baseCompany,
      name: 'New Developer',
      isDeveloper: true,
      isPublisher: false,
    };

    const createMock = vi.fn().mockResolvedValue(newCompany);
    (prisma.company.create as any).mockImplementation(createMock);

    const request = createRequest('New Developer', true, false);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'New Developer',
        isDeveloper: true,
        isPublisher: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: 'New Developer',
        isDeveloper: true,
        isPublisher: false,
      },
    });
  });

  it('should create publisher company', async () => {
    const newCompany = {
      ...baseCompany,
      name: 'New Publisher',
      isDeveloper: false,
      isPublisher: true,
    };

    const createMock = vi.fn().mockResolvedValue(newCompany);
    (prisma.company.create as any).mockImplementation(createMock);

    const request = createRequest('New Publisher', false, true);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'New Publisher',
        isDeveloper: false,
        isPublisher: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it('should create company that is both developer and publisher', async () => {
    const newCompany = {
      ...baseCompany,
      name: 'Both Dev and Pub',
      isDeveloper: true,
      isPublisher: true,
    };

    const createMock = vi.fn().mockResolvedValue(newCompany);
    (prisma.company.create as any).mockImplementation(createMock);

    const request = createRequest('Both Dev and Pub', true, true);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Both Dev and Pub',
        isDeveloper: true,
        isPublisher: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it('should validate name is required', async () => {
    const request = createRequest('', true, false);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name is required');

    const createMock = vi.fn();
    (prisma.company.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should validate role is required', async () => {
    const request = createRequest('Company Name', false, false);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Company must be either developer or publisher');

    const createMock = vi.fn();
    (prisma.company.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const createMock = vi.fn().mockRejectedValue(new Error('Database error'));
    (prisma.company.create as any).mockImplementation(createMock);

    const request = createRequest('New Company', true, false);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating company');
  });

  it('should handle malformed JSON', async () => {
    const request = new Request('http://localhost/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error creating company');

    const createMock = vi.fn();
    (prisma.company.create as any).mockImplementation(createMock);
    expect(createMock).not.toHaveBeenCalled();
  });
});
