'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export async function POST(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
    }

    try {
        await dbConnect();
        const { phone, otp, newPassword } = await request.json();

        if (!phone || !otp || !newPassword) {
            return NextResponse.json({ message: 'Phone, OTP, and new password are required.' }, { status: 400 });
        }

        // 1. Verify OTP
        const otpDoc = await Otp.findOne({ phone, otp });
        if (!otpDoc) {
            return NextResponse.json({ message: 'Invalid or expired OTP.' }, { status: 400 });
        }
        
        // 2. Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        // 3. Update password
        user.password = newPassword;
        await user.save();

        // 4. Delete the used OTP
        await Otp.deleteOne({ _id: otpDoc._id });
        
        return NextResponse.json({ message: 'Password has been reset successfully.' });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'An error occurred while resetting the password.' }, { status: 500 });
    }
}
