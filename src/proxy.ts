import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('access_token')?.value;

    // If no token exists in cookies, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      // Store the original destination to redirect back after login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin routes for performance
export const config = {
  matcher: ['/admin/:path*'],
};
