import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials or JWT_SECRET not defined in .env');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ admin: true, username }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const cookie = serialize('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax',
      });

      const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
      response.headers.set('Set-Cookie', cookie);
      return response;

    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
