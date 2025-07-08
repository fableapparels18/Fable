'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

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
        if (!user) {
            return NextResponse.json({ message: 'No user found with this phone number. Please register first.' }, { status: 404 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        await Otp.findOneAndUpdate(
            { phone },
            { phone, otp, expiresAt },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // --- MOCK OTP SENDING ---
        // In a real application, you would use an SMS service like Twilio here.
        // For this demo, we are logging the OTP to the console for easy testing.
        console.log(`\n\n--- FableFront OTP ---`);
        console.log(`OTP for ${phone}: ${otp}`);
        console.log(`This will expire in 5 minutes.`);
        console.log(`----------------------\n\n`);
        // -------------------------

        return NextResponse.json({ message: 'OTP sent successfully.' });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ message: 'An error occurred while sending the OTP.' }, { status: 500 });
    }
}
