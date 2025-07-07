import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserPayload } from './lib/auth';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  const protectedPaths = ['/profile', '/cart', '/api/cart'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!token || !JWT_SECRET) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
    } catch (err) {
      console.error('Token verification failed:', err);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear the invalid cookie
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/cart', '/api/cart/:path*'],
};
