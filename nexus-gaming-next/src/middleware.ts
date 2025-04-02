import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Pour les routes API (sauf /api/auth/*)
  if (path.startsWith('/api/')) {
    // Laisser passer sans vérification pour l'instant
    return NextResponse.next()
  }

  // Pour les routes admin uniquement
  if (path.startsWith('/admin')) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // N'appliquer que sur les routes admin et api (sauf auth)
    '/admin/:path*',
    '/api/((?!auth).)*'
  ]
}
