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
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log(`[Proxy] NODE_ENV: ${nodeEnv}`);
    
    // Standardized fetching: Priority to INTERNAL_API_URL, then env-based host, then fallback
    let fetchUrl = process.env.INTERNAL_API_URL;
    
    if (!fetchUrl) {
      // Use generic 'backend' as default for Compose/K8s, fallback to 127.0.0.1 for local
      const backendHost = nodeEnv === 'production' ? 'backend' : '127.0.0.1';
      fetchUrl = `http://${backendHost}:3001/api/settings/public`;
    } else {
      // Ensure settings endpoint is appended correctly
      if (!fetchUrl.includes('/settings/public')) {
        fetchUrl = fetchUrl.replace(/\/api\/?$/, '') + '/api/settings/public';
      }
    }
    
    console.log(`[Proxy] Checking maintenance at: ${fetchUrl}`);

    const response = await fetch(fetchUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(4000) 
    });
    
    if (response.ok) {
      const settings = await response.json();
      const isGlobalMaintenance = settings.maintenance_global === 'true' || settings.maintenance_global === true;
      
      console.log(`[Proxy] Maintenance status: ${isGlobalMaintenance}`);
      
      if (isGlobalMaintenance && !bypassCookie) {
        console.log(`[Proxy] REDIRECTING to /maintenance from ${pathname}`);
        const url = new URL('/maintenance', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    } else {
      console.error(`[Proxy] API error: ${response.status} at ${fetchUrl}`);
    }
  } catch (error: any) {
    console.error(`[Proxy] Backend unreachable: ${error.message}`);
    // If we can't reach the backend, we default to allowing access (frontend will handle offline state)
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

export default proxy;
