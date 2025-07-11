'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import { verifyOtp } from '@/lib/twilio';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
    if (!isDbConfigured || !JWT_SECRET) {
        const message = !isDbConfigured ? 'Database not configured.' : 'Server configuration error.';
        return NextResponse.json({ message }, { status: 503 });
    }
    
    try {
        await dbConnect();
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json({ message: 'Phone number and OTP are required.' }, { status: 400 });
        }

        const result = await verifyOtp(phone, otp);

        if (!result.success) {
             return NextResponse.json({ message: result.message }, { status: 400 });
        }
        
        const user = await User.findOne({ phone });
        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        // Create a short-lived token specifically for password reset
        const resetToken = jwt.sign(
            { userId: user._id, phone: user.phone, action: 'reset-password' },
            JWT_SECRET,
            { expiresIn: '15m' } // Token is valid for 15 minutes
        );
        
        return NextResponse.json({ message: 'OTP verified successfully.', resetToken }, { status: 200 });

    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ message: 'An error occurred during verification.' }, { status: 500 });
    }
}
