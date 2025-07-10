'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationOtp, isTwilioConfigured } from '@/lib/twilio';

// Helper to normalize phone number
const normalizePhone = (phone: string): string => {
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+91${phone}`;
};


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

        const normalizedPhone = normalizePhone(phone);
        const user = await User.findOne({ phone: normalizedPhone });

        if (isPasswordReset) {
            if (!user) {
                return NextResponse.json({ message: 'No account found with this phone number.' }, { status: 404 });
            }
        } else {
             if (user) {
                return NextResponse.json({ message: 'A user with this phone number already exists.' }, { status: 409 });
            }
        }

        if (isTwilioConfigured) {
            const result = await sendVerificationOtp(normalizedPhone);
            if (!result.success) {
                return NextResponse.json({ message: result.message }, { status: 500 });
            }
        } else {
            console.log(`\n\n--- FableFront OTP Service (For Development) ---`);
            console.log(`Twilio is not configured. OTP cannot be sent.`);
            console.log(`Please configure Twilio credentials in your .env file.`);
            console.log(`---------------------------------------------------\n\n`);
            return NextResponse.json({ message: 'SMS service is not configured.' }, { status: 503 });
        }

        return NextResponse.json({ message: 'An OTP has been sent to your phone number.' });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ message: 'An error occurred while sending the OTP.' }, { status: 500 });
    }
}
