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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Error fetching category' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SYSADMIN')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, color, isDefault, parentId, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (name !== undefined && (!name || name.trim() === '')) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Validate color format if provided
    if (color !== null && color !== undefined && !HEX_COLOR_REGEX.test(color)) {
      return NextResponse.json(
        { error: 'Invalid color format' },
        { status: 400 }
      );
    }

    // Handle default category logic if needed
    if (isDefault !== undefined) {
      await handleDefaultCategory(id, isDefault);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && name.trim() !== '' && { name: name.trim() }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(parentId !== undefined && { parentId }),
        ...(description !== undefined && { description }),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SYSADMIN')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error deleting category' },
      { status: 500 }
    );
  }
}
