'use server';

import { NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface ResetTokenPayload {
    userId: string;
    phone: string;
    action: 'reset-password';
    iat: number;
    exp: number;
}

export async function POST(request: Request) {
    if (!isDbConfigured || !JWT_SECRET) {
        const message = !isDbConfigured ? 'Database not configured.' : 'Server configuration error.';
        return NextResponse.json({ message }, { status: 503 });
    }

    try {
        await dbConnect();
        const { resetToken, newPassword } = await request.json();

        if (!resetToken || !newPassword) {
            return NextResponse.json({ message: 'A reset token and a new password are required.' }, { status: 400 });
        }

        // 1. Verify the short-lived reset token
        let decoded: ResetTokenPayload;
        try {
            decoded = jwt.verify(resetToken, JWT_SECRET) as ResetTokenPayload;
            if (decoded.action !== 'reset-password') {
                throw new Error('Invalid token action');
            }
        } catch (err) {
            return NextResponse.json({ message: 'Invalid or expired reset token.' }, { status: 401 });
        }
        
        // 2. Find user from token payload
        const user = await User.findById(decoded.userId);
        if (!user || user.phone !== decoded.phone) {
            return NextResponse.json({ message: 'User not found or token mismatch.' }, { status: 404 });
        }

        // 3. Update password
        user.password = newPassword;
        await user.save();
        
        return NextResponse.json({ message: 'Password has been reset successfully.' });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'An error occurred while resetting the password.' }, { status: 500 });
    }
}
