import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from './lib/jwt'
import { canManageAnnouncements } from './lib/permissions'

export async function middleware(request: NextRequest) {
  // Skip si ce n'est pas une route admin
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const user = await getCurrentUser()
  
  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protection spécifique pour les annonces
  if (request.nextUrl.pathname.startsWith('/admin/announcements')) {
    if (!canManageAnnouncements(user.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  // Pour les autres routes admin, vérifier si l'utilisateur est admin
  else if (user.role === 'USER') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
