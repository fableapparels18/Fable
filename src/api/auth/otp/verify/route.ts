'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import Otp from '@/models/Otp';

export async function POST(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured. Authentication is disabled.' }, { status: 503 });
    }
    
    try {
        await dbConnect();
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json({ message: 'Phone number and OTP are required.' }, { status: 400 });
        }

        const otpDoc = await Otp.findOne({ phone, otp });

        if (!otpDoc) {
            return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
        }
        
        // The document has a TTL index, but we can also check manually
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (otpDoc.createdAt < fiveMinutesAgo) {
             await Otp.deleteOne({ _id: otpDoc._id });
             return NextResponse.json({ message: 'OTP has expired.' }, { status: 400 });
        }

        // OTP is verified, but don't delete it yet.
        // It will be deleted upon successful registration or password reset.
        
        return NextResponse.json({ message: 'OTP verified successfully.' }, { status: 200 });

    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ message: 'An error occurred during verification.' }, { status: 500 });
    }
}
