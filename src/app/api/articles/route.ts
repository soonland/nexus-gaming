import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma, ArticleStatus } from '@prisma/client'
import type { ArticleForm } from '@/types'

// GET - Liste des articles
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const search = searchParams.get('search') ?? ''
    const status = searchParams.get('status') ?? undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      status: status ? (status as ArticleStatus) : undefined
    }

    // Get articles with pagination
    const [articles, totalResults] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
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
      }),
      prisma.article.count({ where })
    ])

    const formattedArticles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null
    }))

    return NextResponse.json({
      articles: formattedArticles,
      pagination: {
        total: totalResults,
        pages: Math.ceil(totalResults / limit),
        page,
        limit
      }
    })
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
