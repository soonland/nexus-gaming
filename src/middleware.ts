import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';

// Paths that require authentication
const protectedPaths = ['/profile', '/admin'];

export async function middleware(request: NextRequest) {
  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
};
