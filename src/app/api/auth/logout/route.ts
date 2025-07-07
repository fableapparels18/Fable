import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  });

  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  response.headers.set('Set-Cookie', cookie);

  return response;
}
