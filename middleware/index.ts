import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";

/**
 * Enforces session-based authentication by redirecting unauthenticated requests to the sign-in page.
 *
 * @returns A response that redirects unauthenticated requests to '/sign-in', or allows the request to continue for authenticated sessions.
 */
export async function middleware(request: NextRequest) {
const sessionCookie = getSessionCookie(request);

 // Check cookie presence - prevents obviously unauthorized users
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
  ],
};