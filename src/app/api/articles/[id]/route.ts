import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import type { ArticleForm } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const formattedArticle = {
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Error fetching article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = (await request.json()) as ArticleForm;
    const { gameIds = [] } = data;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        status: data.status,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        games: {
          set: [], // Disconnect all games first
          connect: gameIds.map(gameId => ({ id: gameId })),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        games: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    const formattedArticle = {
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Error updating article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.article.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Error deleting article' },
      { status: 500 }
    );
  }
}
