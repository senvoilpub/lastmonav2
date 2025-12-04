import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain (e.g., "blog" from "blog.lastmona.com")
  const subdomain = hostname.split('.')[0];
  
  // List of static file extensions to exclude from rewriting
  const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.pdf', '.css', '.js', '.json', '.woff', '.woff2', '.ttf', '.eot'];
  const isStaticFile = staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
  
  // Always allow Next.js internal routes and static files to pass through
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    isStaticFile
  ) {
    return NextResponse.next();
  }
  
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
     * - _next/ (all Next.js internal routes including static, image, etc.)
     * - Static file extensions (.png, .jpg, .svg, etc.)
     */
    '/((?!api|_next|.*\\.(png|jpg|jpeg|gif|svg|ico|webp|pdf|css|js|json|woff|woff2|ttf|eot)).*)',
  ],
};

