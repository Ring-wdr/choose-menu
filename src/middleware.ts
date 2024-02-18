import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const hasUserName = request.cookies.has('userName');
  const admin = request.cookies.has('admin');

  if (request.nextUrl.pathname === '/' && hasUserName)
    return NextResponse.redirect(new URL('/menu', request.url));
  if (request.nextUrl.pathname.startsWith('/menu') && !hasUserName)
    return NextResponse.redirect(new URL('/', request.url));
  if (request.nextUrl.pathname.startsWith('/admin/') && !admin)
    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/', '/menu', '/admin/:path*'],
};
