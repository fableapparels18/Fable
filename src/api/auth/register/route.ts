import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ message: 'Database not configured. Registration is disabled.' }, { status: 503 });
  }
  
  await dbConnect();

  try {
    const { name, phone, email, password, otp } = await request.json();

    if (!name || !phone || !password || !otp) {
      return NextResponse.json({ message: 'All fields including OTP are required' }, { status: 400 });
    }

    // Verify OTP
    const otpDoc = await Otp.findOne({ phone, otp });

    if (!otpDoc) {
      return NextResponse.json({ message: 'Invalid or expired OTP.' }, { status: 400 });
    }

    // OTP is verified, delete it
    await Otp.deleteOne({ _id: otpDoc._id });

    // Check for existing users (double-check)
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
