import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ message: 'Database not configured. Registration is disabled.' }, { status: 503 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not defined');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }
  
  await dbConnect();

  try {
    const { name, phone, email, password } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ message: 'Name, phone, and password are required' }, { status: 400 });
    }

    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return NextResponse.json({ message: 'A user with this phone number already exists' }, { status: 409 });
    }

    if (email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return NextResponse.json({ message: 'A user with this email already exists' }, { status: 409 });
      }
    }
    
    const userData: any = { name, phone, password };
    if (email) {
        userData.email = email;
    }

    const newUser = new User(userData);
    await newUser.save();
    
    // Auto-login: Create token and set cookie
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, name: newUser.name, phone: newUser.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    const response = NextResponse.json({ message: 'User registered and logged in successfully' }, { status: 201 });
    response.headers.set('Set-Cookie', cookie);
    
    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ message: `A user with this ${field} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
  }
}
