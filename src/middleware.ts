import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isUserPath = ['/profile', '/cart', '/api/cart'].some(path => pathname.startsWith(path));
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  
  if (!JWT_SECRET) {
    console.error("JWT_SECRET not defined, authentication will fail.");
    if (isUserPath || isAdminPath) {
        const redirectUrl = isAdminPath ? '/admin/login' : '/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(JWT_SECRET);

  if (isAdminPath) {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
        await jwtVerify(adminToken, secret);
    } catch (err) {
      console.error('Admin token verification failed:', err);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }
  
  if (isUserPath) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
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
  matcher: ['/profile', '/cart', '/api/cart/:path*', '/admin/:path*'],
};
