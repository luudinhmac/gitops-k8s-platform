import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Proxy] Processing request: ${pathname}`);

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

  // 2. Check for Bypass Cookie and User Role
  const bypassCookie = request.cookies.get('MAINTENANCE_BYPASS');
  const userToken = request.cookies.get('access_token');
  const userRole = request.cookies.get('user_role')?.value;
  
  const isAdmin = ['admin', 'superadmin'].includes(userRole || '');
  const hasPasscode = !!bypassCookie;

  // 3. Fetch Maintenance Status (with simple in-memory cache)
  try {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const CACHE_KEY = 'MAINTENANCE_STATUS_CACHE';
    const CACHE_TTL = 10000; // 10 seconds
    const now = Date.now();
    const cached = (globalThis as any)[CACHE_KEY];
    
    let isGlobalMaintenance = false;
    
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      isGlobalMaintenance = cached.status;
    } else {
      let fetchUrl = process.env.INTERNAL_API_URL;
      
      if (!fetchUrl) {
        const backendHost = nodeEnv === 'production' ? 'backend' : '127.0.0.1';
        fetchUrl = `http://${backendHost}:3002/api/v1/settings/public`;
      } else {
        if (!fetchUrl.includes('/v1')) {
          fetchUrl = fetchUrl.replace(/\/api\/?$/, '') + '/api/v1';
        }
        if (!fetchUrl.endsWith('/settings/public')) {
          fetchUrl = fetchUrl.replace(/\/$/, '') + '/settings/public';
        }
      }
      
      const response = await fetch(fetchUrl, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(3000) 
      });
      
      if (response.ok) {
        const settings = await response.json();
        isGlobalMaintenance = settings.maintenance_global === 'true' || settings.maintenance_global === true;
        (globalThis as any)[CACHE_KEY] = {
          status: isGlobalMaintenance,
          timestamp: now
        };
      }
    }
    
    // Maintenance Enforcement Logic
    if (isGlobalMaintenance) {
      // 1. If user is Admin, they can bypass EVERYTHING
      if (isAdmin && userToken) {
        return NextResponse.next();
      }

      // 2. If user has passcode, they can ONLY access /login (and its resources)
      if (hasPasscode && (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api'))) {
        return NextResponse.next();
      }

      // 3. Otherwise, if not on maintenance page, redirect to it
      if (pathname !== '/maintenance') {
        console.log(`[Proxy] REDIRECTING to /maintenance from ${pathname} (Maintenance ON, No Admin/Passcode)`);
        const url = new URL('/maintenance', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    }
  } catch (error: any) {
    console.error(`[Proxy] Maintenance check failed: ${error.message}`);
  }

  // 4. Admin Stealth Protection (Original logic preserved)
  if (pathname.startsWith('/portal-dashboard') && pathname !== '/portal-dashboard/login') {
    const allCookies = request.cookies.getAll().map(c => c.name);
    const token = request.cookies.get('token') || request.cookies.get('access_token');
    if (!token) {
      console.log(`[Security] Unauthorized access to ${pathname}. Cookies found: ${allCookies.join(', ') || 'none'}. Rewriting to 404.`);
      // We rewrite to a non-existent path to trigger a real 404 response
      // This ensures the HTTP status code is 404, not 200 or 302.
      return NextResponse.rewrite(new URL('/not-found-stealth', request.url));
    }
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

export default proxy;

