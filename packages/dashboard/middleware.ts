import { NextResponse, type NextRequest } from 'next/server';

// List of hostnames that should be handled by the Next.js app
const ALLOWED_HOSTNAMES = ['localhost:3000'];

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/register',
  '/terms',
  '/privacy',
  '/api/auth',
  '/api/auth/session',
  '/_next',
  '/favicon.ico',
  '/_error',
];

export async function middleware(req: NextRequest) {
  const { pathname, search, hostname } = req.nextUrl;
  // Handle auth routes - redirect to our API auth endpoints
  if (pathname.startsWith('/auth/')) {
    const newPath = `/api/auth/${pathname.split('/').slice(2).join('/')}`;
    const url = new URL(newPath, req.url);
    // Preserve all query parameters
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return NextResponse.redirect(url);
  }

  // Handle external auth requests (from other services)
  if (hostname === 'localhost' && req.nextUrl.port === '4000') {
    // Rewrite the URL to be handled by the Next.js app
    const url = req.nextUrl.clone();
    url.hostname = 'localhost';
    url.port = '3000';
    return NextResponse.rewrite(url);
  }

  // Only process requests to our Next.js app
  if (!ALLOWED_HOSTNAMES.includes(hostname + (req.nextUrl.port ? `:${req.nextUrl.port}` : ''))) {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  // Handle NextAuth.js internal API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for session token for protected routes
  if (!sessionToken) {
    let intendedPath = pathname !== '/' ? pathname + search : '';
    const url = new URL('/api/auth/signin', req.url);
    if (intendedPath) {
      url.searchParams.set('callbackUrl', intendedPath);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
