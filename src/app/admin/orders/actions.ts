'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function updateOrderStatus(orderId: string, status: 'Out for Delivery' | 'Delivered' | 'Cancelled') {
    try {
        await dbConnect();
        await Order.findByIdAndUpdate(orderId, { status });
    } catch (error) {
        console.error('Failed to update order status:', error);
        return {
            message: 'Database Error: Failed to update order status.',
        };
    }

    revalidatePath('/admin/orders');
}
