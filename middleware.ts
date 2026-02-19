// middleware.ts
// NextJS Starter - Route Protection Middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────
// Route configuration
// ─────────────────────────────────────────────

/** Routes accessible without any authentication */
const PUBLIC_ROUTES: string[] = [
  '/',
  '/login',
  '/register',
  '/terms-of-service',
  '/privacy-policy',
];

/**
 * Routes that require ADMIN or SUPERADMIN role.
 * Add new admin-only routes here.
 * Supports prefix matching: '/admin' covers '/admin', '/admin/users', etc.
 */
const ADMIN_ROUTE_PREFIXES: string[] = [
  '/admin',
];

/**
 * Routes that require SUPERADMIN role only.
 * Add new superadmin-only routes here.
 */
const SUPERADMIN_ROUTE_PREFIXES: string[] = [
  '/superadmin',
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  );
}

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

// ─────────────────────────────────────────────
// NOTE: Better Auth uses JWT/session cookies that
// require DB access to verify — not available in
// Edge Runtime. Role-based enforcement here is a
// lightweight first-pass; the real guard lives in
// each page component and API route handler.
// ─────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // 2. Always allow Better Auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 3. Public routes — pass through
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 4. Admin/Superadmin routes — redirect to login if no session cookie exists.
  //    Full role verification is handled by the page/API route after DB lookup.
  if (
    matchesPrefix(pathname, ADMIN_ROUTE_PREFIXES) ||
    matchesPrefix(pathname, SUPERADMIN_ROUTE_PREFIXES)
  ) {
    // Better Auth stores session as "better-auth.session_token"
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Has cookie → let the page/API do the full role check
    return NextResponse.next();
  }

  // 5. All other protected routes — pass through (auth checked in page/API)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|images|icons).*)',
  ],
};