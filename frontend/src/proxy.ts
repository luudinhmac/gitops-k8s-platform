import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define excluded paths (always accessible)
  const isExcludedPath = 
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images');

  if (isExcludedPath) {
    return NextResponse.next();
  }

  // 2. Check for Bypass Cookie
  const bypassCookie = request.cookies.get('MAINTENANCE_BYPASS');
  
    // 3. Fetch Maintenance Status
    try {
      // Always call backend directly on port 3001 from the server-side proxy
      // to avoid infinite loops if NEXT_PUBLIC_API_URL points to the frontend itself.
      const fetchUrl = 'http://127.0.0.1:3001/api/settings/public';
      
      console.log(`[Proxy] Checking maintenance at: ${fetchUrl}`);

      const response = await fetch(fetchUrl, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(3000) 
      });
      
      if (response.ok) {
        const settings = await response.json();
        console.log(`[Proxy] Status:`, settings.maintenance_global);
        
        const isGlobalMaintenance = settings.maintenance_global === 'true' || settings.maintenance_global === true;
        
        if (isGlobalMaintenance && !bypassCookie) {
          console.log(`[Proxy] REDIRECTING to /maintenance from ${pathname}`);
          const url = new URL('/maintenance', request.url);
          url.searchParams.set('from', pathname);
          return NextResponse.redirect(url);
        }
      } else {
        console.error(`[Proxy] API error: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`[Proxy] Fetch failed: ${error.message}`);
      return NextResponse.next();
    }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
