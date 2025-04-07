import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { ArticleForm, ArticleData } from '@/types'

// GET - Liste des articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
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
      orderBy: {
        publishedAt: 'desc',
      },
    })

    const formattedArticles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null
    }))
    return NextResponse.json(formattedArticles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Error fetching articles' },
      { status: 500 }
    )
  }
}

// POST - Créer un article
export async function POST(request: Request) {
  try {
    const data = await request.json() as ArticleForm
    const { title, content, categoryId, status, publishedAt, gameIds = [] } = data

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      )
    }

    // TODO: Récupérer le vrai userId depuis l'authentification
    const defaultUserId = 'clm1234567890'

    const article = await prisma.article.create({
      data: {
        title,
        content,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        userId: defaultUserId,
        games: {
          connect: gameIds.map((id) => ({ id })),
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
          },
        },
      },
    })

    const formattedArticle = {
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null
    }
    return NextResponse.json(formattedArticle, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Error creating article' },
      { status: 500 }
    )
  }
}
