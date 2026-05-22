import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const rawIp = 
    request.headers.get('cf-connecting-ip') || 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    '';
  const clientIp = rawIp.split(',')[0].trim();
  
  const requestHeaders = new Headers(request.headers);
  if (clientIp) {
    requestHeaders.set('x-original-client-ip', clientIp);
  }

  // 2. Log incoming requests for diagnostics (useful for identifying scanning/attacks)
  console.log(`[Proxy] Processing request: ${pathname} from IP: ${clientIp || 'unknown'}`);

  // 3. Early pass-through for API and Uploads with client IP header injected
  const isApiOrUpload = pathname.startsWith('/api') || pathname.startsWith('/uploads');
  if (isApiOrUpload) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 4. Define excluded paths (always accessible pages)
  const isExcludedPath = 
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images');

  if (isExcludedPath) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 5. Check for Bypass Cookie and User Role
  const bypassCookie = request.cookies.get('MAINTENANCE_BYPASS');
  const userToken = request.cookies.get('access_token');
  const userRole = request.cookies.get('user_role')?.value;
  
  const isAdmin = ['admin', 'superadmin'].includes(userRole || '');
  const hasPasscode = !!bypassCookie;

  // 6. Fetch Maintenance Status (with simple in-memory cache)
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
        throw new Error('INTERNAL_API_URL is not defined in proxy middleware');
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
      // Admin can bypass everything
      if (isAdmin && userToken) {
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }

      // Users with passcode can access login and static pages
      if (hasPasscode && (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api'))) {
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }

      // Redirect general traffic to maintenance page
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

  // 7. Admin Stealth Protection (Original logic preserved)
  if (pathname.startsWith('/portal-dashboard') && pathname !== '/portal-dashboard/login') {
    const allCookies = request.cookies.getAll().map(c => c.name);
    const token = request.cookies.get('token') || request.cookies.get('access_token');
    if (!token) {
      console.log(`[Security] Unauthorized access to ${pathname}. Cookies found: ${allCookies.join(', ') || 'none'}. Rewriting to 404.`);
      return NextResponse.rewrite(new URL('/not-found-stealth', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Next.js middleware matching configurations
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default proxy;

