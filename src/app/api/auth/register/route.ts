import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ message: 'Database not configured. Registration is disabled.' }, { status: 503 });
  }
  
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
  }
}
