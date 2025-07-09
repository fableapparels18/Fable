import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(token: string, secret: Uint8Array) {
    try {
        await jwtVerify(token, secret);
        return true;
    } catch (err) {
        return false;
    }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin-token')?.value;
  
  if (!JWT_SECRET) {
    console.error("JWT_SECRET not defined, authentication will fail.");
    if (pathname.startsWith('/admin') || pathname.startsWith('/profile')) {
        const redirectUrl = pathname.startsWith('/admin') ? '/admin/login' : '/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(JWT_SECRET);
  const isUserAuthPath = pathname === '/login' || pathname === '/register';
  const isUserProtectedPath = ['/profile', '/cart', '/api/cart', '/api/orders'].some(path => pathname.startsWith(path));
  const isAdminProtectedPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  
  // Handle authenticated users trying to access login/register
  if (isUserAuthPath && token && (await verifyToken(token, secret))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  // Handle user protected paths
  if (isUserProtectedPath) {
      if (!token || !(await verifyToken(token, secret))) {
          const response = pathname.startsWith('/api/')
            ? NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
            : NextResponse.redirect(new URL('/login', request.url));
          
          if(token) response.cookies.delete('token');
          return response;
      }
  }
  
  // Handle admin protected paths
  if (isAdminProtectedPath) {
      if (!adminToken || !(await verifyToken(adminToken, secret))) {
          const response = NextResponse.redirect(new URL('/admin/login', request.url));
          if(adminToken) response.cookies.delete('admin-token');
          return response;
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/cart', '/api/cart/:path*', '/api/orders/:path*', '/admin/:path*', '/login', '/register'],
};
