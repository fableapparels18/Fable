import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ message: 'Database not configured. Authentication is disabled.' }, { status: 503 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not defined');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }
  
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });
    
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login', error: error.message }, { status: 500 });
  }
}
