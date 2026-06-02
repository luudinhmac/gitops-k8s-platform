import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate dynamic CSP nonce
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = isDev 
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;`
    : `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://static.cloudflareinsights.com;`;

  const cspHeader = `default-src 'self'; ${scriptSrc} style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http://localhost:3001 http://portfolio-backend-staging:3001; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://staging.luumac.io.vn https://cloudflareinsights.com http://localhost:3001 http://portfolio-backend-staging:3001; frame-ancestors 'self';`;

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
  
  // Set x-nonce header in request headers so Server Components can read it
  requestHeaders.set('x-nonce', nonce);

  const isApiOrUpload = pathname.startsWith('/api') || pathname.startsWith('/uploads');
  const setCSP = (res: NextResponse) => {
    if (!isApiOrUpload) {
      res.headers.set('Content-Security-Policy', cspHeader);
    }
    return res;
  };

  // 1. Log incoming requests for diagnostics
  console.log(`[Middleware] Processing request: ${pathname} from IP: ${clientIp || 'unknown'}`);

  // 2. Dynamic Runtime Proxy for API and Uploads
  if (isApiOrUpload) {
    let fetchUrl = process.env.INTERNAL_API_URL;
    if (!fetchUrl) {
      console.warn('[Middleware] INTERNAL_API_URL is not defined in middleware. Passing request through.');
      return setCSP(NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      }));
    }

    // Remove trailing slash, /api/v1, AND /api to get the true root
    const backendBaseUrl = fetchUrl
        .replace(/\/api\/v1\/?$/, '')
        .replace(/\/api\/?$/, '')
        .replace(/\/$/, '');

    const targetUrl = new URL(pathname + request.nextUrl.search, backendBaseUrl);
    console.log(`[Middleware] Proxying API/Uploads: ${pathname} -> ${targetUrl.toString()}`);
    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Define excluded paths (always accessible pages)
  const isExcludedPath = 
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images');

  if (isExcludedPath) {
    return setCSP(NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }));
  }

  // 4. Check for Bypass Cookie and User Role
  const bypassCookie = request.cookies.get('MAINTENANCE_BYPASS');
  const userToken = request.cookies.get('access_token');
  const userRole = request.cookies.get('user_role')?.value;
  
  const isAdmin = ['admin', 'superadmin'].includes(userRole || '');
  const hasPasscode = !!bypassCookie;

  // 5. Check for Maintenance Status (with simple in-memory cache)
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
      if (isAdmin && userToken) {
        return setCSP(NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        }));
      }

      if (hasPasscode && (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api'))) {
        return setCSP(NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        }));
      }

      if (pathname !== '/maintenance') {
        console.log(`[Middleware] REDIRECTING to /maintenance from ${pathname} (Maintenance ON, No Admin/Passcode)`);
        const url = new URL('/maintenance', request.url);
        url.searchParams.set('from', pathname);
        return setCSP(NextResponse.redirect(url));
      }
    }
  } catch (error: any) {
    console.error(`[Middleware] Maintenance check failed: ${error.message}`);
  }

  // 6. Admin Stealth Protection
  if (pathname.startsWith('/portal-dashboard') && pathname !== '/portal-dashboard/login') {
    const allCookies = request.cookies.getAll().map(c => c.name);
    const token = request.cookies.get('token') || request.cookies.get('access_token');
    if (!token) {
      console.log(`[Security] Unauthorized access to ${pathname}. Cookies found: ${allCookies.join(', ') || 'none'}. Rewriting to 404.`);
      return setCSP(NextResponse.rewrite(new URL('/not-found-stealth', request.url)));
    }
  }

  return setCSP(NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  }));
}

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
