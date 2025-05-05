import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

// Hex color format validation regex
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

// Ensure only one default category exists
async function handleDefaultCategory(id: string, isDefault: boolean) {
  if (isDefault) {
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
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
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
    const { name, description, color, isDefault, parentId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (color && !HEX_COLOR_REGEX.test(color)) {
      return NextResponse.json(
        { error: 'Invalid color format' },
        { status: 400 }
      );
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }

      if (parentCategory.parentId) {
        return NextResponse.json(
          { error: 'Cannot create nested subcategories beyond one level' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        color,
        isDefault: isDefault || false,
        parentId,
      },
      include: {
        parent: true,
        subCategories: true,
      },
    });

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

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SYSADMIN')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, color, isDefault, parentId } = body;

    if (color && !HEX_COLOR_REGEX.test(color)) {
      return NextResponse.json(
        { error: 'Invalid color format' },
        { status: 400 }
      );
    }

    if (parentId) {
      if (parentId === id) {
        return NextResponse.json(
          { error: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }

      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }

      if (parentCategory.parentId) {
        return NextResponse.json(
          { error: 'Cannot create nested subcategories beyond one level' },
          { status: 400 }
        );
      }
    }

    const updateData = {
      ...(name && {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
      ...(description !== undefined && { description }),
      ...(color !== undefined && { color }),
      ...(parentId !== undefined && { parentId }),
      ...(isDefault !== undefined && { isDefault }),
    };

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        subCategories: true,
      },
    });

    if (isDefault) {
      await handleDefaultCategory(category.id, true);
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    );
  }
}
