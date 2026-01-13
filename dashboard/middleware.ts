import { NextRequest, NextResponse } from 'next/server';

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

export function middleware(request: NextRequest) {
  // CSRF Protection: Verify origin/referer for POST requests
  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Verify that the request is coming from our domain
    if (origin && !origin.includes(host || '')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Cross-site request forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (referer && !referer.includes(host || '')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Cross-site request forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Rate limiting: Limit requests per IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim() : 'unknown';
  const url = request.nextUrl.pathname;
  const key = `${ip}:${url}`;

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per window

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
  } else {
    const record = rateLimitStore.get(key);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
      if (record.count > maxRequests) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Rate limit exceeded' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Protect admin routes (except login page)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      request.nextUrl.pathname !== '/admin/login' &&
      !request.nextUrl.pathname.startsWith('/api')) {
    // Check if user is authenticated by looking for auth token in cookies or headers
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // For API routes that require auth
  if (request.nextUrl.pathname.startsWith('/api') &&
      (request.nextUrl.pathname.includes('/hero-images') ||
       request.nextUrl.pathname.includes('/team-members'))) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/hero-images', '/api/team-members'],
};