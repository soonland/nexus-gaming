import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

// Hex color format validation regex
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

// Ensure only one default category exists
async function handleDefaultCategory(id: string, isDefault: boolean) {
  if (isDefault) {
    // Remove default from all other categories first
    await prisma.category.updateMany({
      where: {
        NOT: {
          id: id,
        },
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to include the count directly
    const formattedCategories = categories.map(category => ({
      ...category,
      articleCount: category._count.articles,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SYSADMIN')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, color, isDefault } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Validate color format if provided
    if (color !== null && color !== undefined && !HEX_COLOR_REGEX.test(color)) {
      return NextResponse.json(
        { error: 'Invalid color format' },
        { status: 400 }
      );
    }

    // Create category first to get its ID
    const category = await prisma.category.create({
      data: {
        name,
        color,
        isDefault: isDefault || false,
      },
    });

    // Handle default category logic if needed
    if (isDefault) {
      await handleDefaultCategory(category.id, true);
    }

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
}
