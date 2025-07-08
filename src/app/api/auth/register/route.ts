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
    const { name, phone, email, password } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ message: 'Name, phone number and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
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

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData: any = {
        name,
        phone,
        password: hashedPassword,
    };
    if (email) {
        userData.email = email;
    }

    const newUser = new User(userData);

    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ message: `A user with this ${field} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
  }
}
