import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain (e.g., "blog" from "blog.lastmona.com")
  const subdomain = hostname.split('.')[0];
  
  // Handle blog subdomain
  if (subdomain === 'blog' && !hostname.includes('localhost')) {
    // Rewrite to the blog page
    if (url.pathname === '/') {
      url.pathname = '/blog';
      return NextResponse.rewrite(url);
    }
    // For other paths on blog subdomain, rewrite to /blog/[path]
    if (!url.pathname.startsWith('/blog')) {
      url.pathname = `/blog${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

