'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import type { ProductFormData } from '@/lib/schemas';

export async function addProduct(data: ProductFormData) {
    try {
        await dbConnect();
        
        const newProduct = new ProductModel({
            _id: `prod_${Date.now()}`,
            ...data,
            images: data.images.split(',').map(url => url.trim()).filter(url => url),
            details: data.details.split('\n').map(detail => detail.trim()).filter(detail => detail),
        });

        await newProduct.save();
    } catch (error) {
        console.error('Failed to create product:', error);
        return {
            message: 'Database Error: Failed to Create Product.',
        };
    }
    
    revalidatePath('/admin/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
    try {
        await dbConnect();
        await ProductModel.findByIdAndDelete(productId);
    } catch (error) {
        console.error('Failed to delete product:', error);
        return {
            message: 'Database Error: Failed to Delete Product.',
        };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
}
