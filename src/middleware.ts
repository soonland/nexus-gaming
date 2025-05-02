import type { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canAccessDashboard } from '@/lib/permissions';

export async function middleware(request: NextRequest) {
  try {
    // All admin routes start with /admin
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    if (!isAdminRoute) {
      return NextResponse.next();
    }

    // Admin route protection
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Vérifier les permissions d'accès au dashboard
    if (!canAccessDashboard(user.role as Role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
