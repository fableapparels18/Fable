'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { UserPayload } from '@/lib/auth';
import { AddressFormData, ProfileFormData } from '@/lib/schemas';
import type { Types } from 'mongoose';

async function getUserIdFromToken(): Promise<string | null> {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not defined');
        return null;
    }
    const token = cookies().get('token')?.value;
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

export async function getUserWithAddresses() {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return null;
    }

    try {
        await dbConnect();
        const user = await User.findById(userId).lean();
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return null;
    }
}

export async function addAddress(data: AddressFormData) {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, message: 'Authentication Error.' };
    }

    try {
        await dbConnect();
        await User.findByIdAndUpdate(userId, {
            $push: { addresses: data }
        });
    } catch (error) {
        return { success: false, message: 'Database Error: Failed to add address.' };
    }

    revalidatePath('/profile/addresses');
    return { success: true, message: 'Address added successfully!' };
}

export async function deleteAddress(addressId: string | Types.ObjectId) {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, message: 'Authentication Error.' };
    }
    
    try {
        await dbConnect();
        await User.findByIdAndUpdate(userId, {
            $pull: { addresses: { _id: addressId } }
        });
    } catch (error) {
        console.error('Failed to delete address:', error)
        return { success: false, message: 'Database Error: Failed to delete address.' };
    }
    
    revalidatePath('/profile/addresses');
    return { success: true, message: 'Address deleted successfully!' };
}


export async function updateUserDetails(data: ProfileFormData) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error('JWT_SECRET not defined');
        return { success: false, message: 'Server configuration error.' };
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, message: 'Authentication Error.' };
    }

    try {
        await dbConnect();

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return { success: false, message: 'User not found.' };
        }
        
        userToUpdate.name = data.name;

        if (data.email && data.email !== userToUpdate.email) {
            const existingUserByEmail = await User.findOne({ email: data.email, _id: { $ne: userId } });
            if (existingUserByEmail) {
                return { success: false, message: 'A user with this email already exists.' };
            }
            userToUpdate.email = data.email;
        } else if (!data.email) {
            userToUpdate.email = undefined;
        }

        await userToUpdate.save();

        // Re-issue JWT with updated details
        const token = jwt.sign(
            { userId: userToUpdate._id, email: userToUpdate.email, name: userToUpdate.name, phone: userToUpdate.phone },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });

    } catch (error) {
        console.error('Failed to update user details:', error);
        return { success: false, message: 'Database Error: Failed to update details.' };
    }

    revalidatePath('/profile');
    revalidatePath('/profile/edit');
    return { success: true, message: 'Profile updated successfully!' };
}