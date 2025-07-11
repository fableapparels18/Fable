import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import User from '@/models/User';
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


export async function POST(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
    }
    
    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        await dbConnect();
        const { addressId } = await request.json();

        if (!addressId) {
            return NextResponse.json({ message: 'Shipping address is required.' }, { status: 400 });
        }

        const [cart, user] = await Promise.all([
            Cart.findOne({ userId }).populate('items.productId'),
            User.findById(userId) // Removed .lean() to get a full Mongoose document
        ]);

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ message: 'Your cart is empty' }, { status: 400 });
        }
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!shippingAddress) {
             return NextResponse.json({ message: 'Invalid shipping address selected.' }, { status: 400 });
        }

        const totalAmount = cart.items.reduce((acc, item) => {
            const productPrice = (item.productId as any).price || 0;
            return acc + productPrice * item.quantity;
        }, 0);

        const orderItems = cart.items.map(item => ({
            productId: (item.productId as any)._id,
            name: (item.productId as any).name,
            image: (item.productId as any).images[0],
            size: item.size,
            quantity: item.quantity,
            price: (item.productId as any).price
        }));

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalAmount,
            status: 'Pending',
            shippingAddress: shippingAddress.toObject(), // .toObject() will now work correctly
        });

        await newOrder.save();

        // Clear the cart
        await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

        return NextResponse.json({ message: 'Order placed successfully!', orderId: newOrder._id }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'An error occurred while placing the order', error: error.message }, { status: 500 });
    }
}
