import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Liste des sociétés
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Error fetching companies' },
      { status: 500 }
    )
  }
}

// POST - Créer une société
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, isDeveloper, isPublisher } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!isDeveloper && !isPublisher) {
      return NextResponse.json(
        { error: 'Company must be either developer or publisher' },
        { status: 400 }
      )
    }

    const company = await prisma.company.create({
      data: {
        name,
        isDeveloper,
        isPublisher,
      },
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Error creating company' },
      { status: 500 }
    )
  }
}
