import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET - Liste des sociétés
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role');

    // Build where clause
    const where: Prisma.CompanyWhereInput = {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            }
          : {},
        role === 'developer' ? { isDeveloper: true } : {},
        role === 'publisher' ? { isPublisher: true } : {},
      ],
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get companies with pagination
    const [companies, totalResults] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.company.count(),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        total: totalResults,
        pages: Math.ceil(totalResults / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Error fetching companies' },
      { status: 500 }
    );
  }
}

// POST - Créer une société
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, isDeveloper, isPublisher } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!isDeveloper && !isPublisher) {
      return NextResponse.json(
        { error: 'Company must be either developer or publisher' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        isDeveloper,
        isPublisher,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Error creating company' },
      { status: 500 }
    );
  }
}
