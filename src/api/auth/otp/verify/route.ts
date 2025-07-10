'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import { verifyOtp } from '@/lib/twilio';

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

        const result = await verifyOtp(phone, otp);

        if (!result.success) {
             return NextResponse.json({ message: result.message }, { status: 400 });
        }
        
        return NextResponse.json({ message: 'OTP verified successfully.' }, { status: 200 });

    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ message: 'An error occurred during verification.' }, { status: 500 });
    }
}
