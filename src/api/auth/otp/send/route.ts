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
        const { phone, isPasswordReset } = await request.json();

        if (!phone) {
            return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
        }

        const user = await User.findOne({ phone });

        if (isPasswordReset) {
            if (!user) {
                return NextResponse.json({ message: 'No account found with this phone number.' }, { status: 404 });
            }
        } else {
             if (user) {
                return NextResponse.json({ message: 'A user with this phone number already exists.' }, { status: 409 });
            }
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        await Otp.findOneAndUpdate(
            { phone },
            { phone, otp, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // --- MOCK OTP SENDING ---
        console.log(`\n\n--- FableFront OTP Service (For Development) ---`);
        console.log(`OTP for ${phone}: ${otp}`);
        console.log(`This will expire in 5 minutes.`);
        console.log(`In a production app, this would be sent via a real SMS service.`);
        console.log(`---------------------------------------------------\n\n`);
        // -------------------------

        return NextResponse.json({ message: 'OTP sent successfully.' });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ message: 'An error occurred while sending the OTP.' }, { status: 500 });
    }
}
