import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

async function generateUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const article = await prisma.article.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!article) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const currentId = searchParams.get('currentId');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    });

    if (!existingArticle) {
      return NextResponse.json({ exists: false, suggestion: slug });
    }

    // If slug exists, generate a suggestion
    const suggestion = await generateUniqueSlug(slug, currentId || undefined);

    return NextResponse.json({
      exists: true,
      suggestion,
    });
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json({ error: 'Error checking slug' }, { status: 500 });
  }
}
