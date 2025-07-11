import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
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
        return NextResponse.json({ items: [] });
    }
    
    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return NextResponse.json({ items: [] });
        }

        return NextResponse.json(cart);

    } catch (error: any) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ message: 'An error occurred while fetching the cart', error: error.message }, { status: 500 });
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
        const { productId, size, quantity = 1 } = await request.json();

        if (!productId || !size) {
            return NextResponse.json({ message: 'Product ID and size are required' }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        if (!product.sizes.includes(size)) {
            return NextResponse.json({ message: 'Selected size is not available for this product' }, { status: 400 });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, size, quantity });
        }
        
        await cart.save();
        const populatedCart = await cart.populate('items.productId');
        
        return NextResponse.json(populatedCart);

    } catch (error: any) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ message: 'An error occurred while adding to cart', error: error.message }, { status: 500 });
    }
}


export async function PUT(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
    }
    
    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        await dbConnect();
        const { productId, size, quantity } = await request.json();

        if (!productId || !size || quantity === undefined) {
            return NextResponse.json({ message: 'Product ID, size, and quantity are required' }, { status: 400 });
        }
        
        if (quantity < 1) {
            // Let the DELETE handler manage removal
            return NextResponse.json({ message: 'Quantity cannot be less than 1. Use DELETE to remove item.' }, { status: 400 });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            const populatedCart = await cart.populate('items.productId');
            return NextResponse.json(populatedCart);
        } else {
            return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
        }
    } catch (error: any) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ message: 'An error occurred while updating the cart', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!isDbConfigured) {
        return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { productId, size } = await request.json();

        if (!productId || !size) {
            return NextResponse.json({ message: 'Product ID and size are required' }, { status: 400 });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId, size } } },
            { new: true }
        ).populate('items.productId');

        if (!cart) {
             return NextResponse.json({ items: [] });
        }

        return NextResponse.json(cart);
    } catch (error: any) {
        console.error('Error deleting item from cart:', error);
        return NextResponse.json({ message: 'An error occurred while deleting item from cart', error: error.message }, { status: 500 });
    }
}
