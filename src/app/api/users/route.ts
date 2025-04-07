import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/jwt'
import { Prisma, Role } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser || tokenUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const search = searchParams.get('search') ?? ''
    const role = searchParams.get('role') ?? undefined
    const status = searchParams.get('status') ?? undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.UserWhereInput = {
      AND: [
        search ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
          ]
        } : {},
        role ? { role: role as Role } : {},
        status ? { isActive: status === 'active' } : {}
      ]
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { articles: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const tokenUser = await getCurrentUser()
    
    if (!tokenUser || tokenUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, email, password, role = 'USER' } = body

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // Note: In a real app, you should hash the password
        role,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
