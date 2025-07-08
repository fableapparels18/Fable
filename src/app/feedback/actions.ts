'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import type { UserPayload } from '@/lib/auth';
import type { FeedbackFormData } from '@/lib/schemas';

async function getUserFromToken(): Promise<UserPayload | null> {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined');
      return null;
    }
    const token = cookies().get('token')?.value;
    if (!token) {
      return null;
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    } catch (error) {
      return null;
    }
}


export async function addFeedback(productId: string, data: FeedbackFormData) {
    const user = await getUserFromToken();
    if (!user) {
        return { success: false, message: 'Authentication Error: You must be logged in to leave feedback.' };
    }

    try {
        await dbConnect();
        const newFeedback = new Feedback({
            ...data,
            productId,
            userId: user.userId,
            userName: user.name,
        });
        await newFeedback.save();
    } catch (error) {
        console.error('Failed to add feedback:', error);
        return { success: false, message: 'Database Error: Failed to add feedback.' };
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath('/admin/feedback');
    return { success: true, message: 'Feedback submitted successfully!' };
}

export async function deleteFeedback(feedbackId: string) {
    try {
        await dbConnect();
        await Feedback.findByIdAndDelete(feedbackId);
    } catch (error) {
        console.error('Failed to delete feedback:', error);
        return { message: 'Database Error: Failed to delete feedback.' };
    }

    revalidatePath('/admin/feedback');
}