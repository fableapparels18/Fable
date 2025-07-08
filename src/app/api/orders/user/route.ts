import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import Order from '@/models/Order';
import type { UserPayload } from '@/lib/auth';

async function getUserIdFromToken(): Promise<string | null> {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined');
      return null;
    }
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return null;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
      return decoded.userId;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
}

export async function GET() {
    if (!isDbConfigured) {
        return NextResponse.json([]);
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(orders)));
    } catch (error: any) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ message: 'An error occurred while fetching orders' }, { status: 500 });
    }
}
