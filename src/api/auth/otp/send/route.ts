'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { sendOtpSms, isTwilioConfigured } from '@/lib/twilio';

export async function POST(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured. Authentication is disabled.' }, { status: 503 });
    }

    try {
        await dbConnect();
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
        }

        const user = await User.findOne({ phone });
        if (user) {
            return NextResponse.json({ message: 'A user with this phone number already exists.' }, { status: 409 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        await Otp.findOneAndUpdate(
            { phone },
            { phone, otp, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        // --- NEW: SEND OTP VIA TWILIO (with fallback) ---
        await sendOtpSms(phone, otp);

        const message = isTwilioConfigured
            ? 'An OTP has been sent to your phone number.'
            : 'OTP generated. Check your server console, as Twilio is not configured.';
        // ------------------------------------------------

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ message: 'An error occurred while sending the OTP.' }, { status: 500 });
    }
}
