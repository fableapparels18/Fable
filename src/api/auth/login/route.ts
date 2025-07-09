import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ message: 'Database not configured. Authentication is disabled.' }, { status: 503 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not defined');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    await dbConnect();
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ message: 'Phone number and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ phone }).select('+password');
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: false,
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
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}
