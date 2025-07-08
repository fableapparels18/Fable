import type { Product } from '@/models/Product';
import ProductModel from '@/models/Product';
import OrderModel, { type IOrder } from '@/models/Order';
import FeedbackModel, { type IFeedback } from '@/models/Feedback';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';
import { initialProducts } from '@/lib/initial-data';

export type { Product };

let seeded = false;
async function seedProducts() {
    if (seeded || !isDbConfigured) {
      return;
    }
    // Let errors from dbConnect or Mongoose bubble up to the caller.
    await dbConnect();
    const count = await ProductModel.countDocuments();
    if (count === 0) {
        console.log('No products found. Seeding database...');
        await ProductModel.insertMany(initialProducts);
        console.log('Database seeded with initial products.');
    }
    seeded = true;
}

const handleDbError = (error: any, functionName: string) => {
    if (error.message.includes('bad auth')) {
        console.error(`MongoDB authentication failed in ${functionName}. Please double-check your MONGODB_URI in .env.local. Falling back to static data.`);
    } else {
        console.error(`Database error in ${functionName}: ${error.message}. Falling back to static data.`);
    }
};

export async function getTrendingProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts.filter((p) => p.isTrending);
  }
  try {
    await seedProducts();
    const products = await ProductModel.find({ isTrending: true }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getTrendingProducts');
    return initialProducts.filter((p) => p.isTrending);
  }
}

export async function getNewProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts.filter((p) => p.isNew);
  }
  try {
    await seedProducts();
    const products = await ProductModel.find({ isNew: true }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getNewProducts');
    return initialProducts.filter((p) => p.isNew);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts;
  }
  try {
    await seedProducts();
    const products = await ProductModel.find({}).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getAllProducts');
    return initialProducts;
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  if (!isDbConfigured) {
    const product = initialProducts.find((p) => p._id === productId);
    return product || null;
  }
  try {
    await seedProducts();
    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      return null;
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    handleDbError(error, `getProductById (ID: ${productId})`);
    // Fallback for demo purposes, in a real app you might not want this
    const product = initialProducts.find((p) => p._id === productId);
    return product || null;
  }
}

export async function getPendingOrders(): Promise<IOrder[]> {
    if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        const orders = await OrderModel.find({ status: { $in: ['Pending', 'Out for Delivery'] } }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(orders));
    } catch (error: any) {
        handleDbError(error, 'getPendingOrders');
        return [];
    }
}

export async function getRecentCompletedOrders(): Promise<IOrder[]> {
     if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        // Fetch last 30 delivered orders
        const orders = await OrderModel.find({ status: 'Delivered' }).sort({ updatedAt: -1 }).limit(30).lean();
        return JSON.parse(JSON.stringify(orders));
    } catch (error: any) {
        handleDbError(error, 'getRecentCompletedOrders');
        return [];
    }
}


export async function getRecentCancelledOrders(): Promise<IOrder[]> {
     if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        // Fetch last 30 cancelled orders
        const orders = await OrderModel.find({ status: 'Cancelled' }).sort({ updatedAt: -1 }).limit(30).lean();
        return JSON.parse(JSON.stringify(orders));
    } catch (error: any) {
        handleDbError(error, 'getRecentCancelledOrders');
        return [];
    }
}

export async function getFeedbackByProductId(productId: string): Promise<IFeedback[]> {
    if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        const feedback = await FeedbackModel.find({ productId }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(feedback));
    } catch (error: any) {
        handleDbError(error, 'getFeedbackByProductId');
        return [];
    }
}

export async function getAllFeedback(): Promise<(IFeedback & { productId: { name: string } })[]> {
    if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        const feedback = await FeedbackModel.find({}).sort({ createdAt: -1 }).populate('productId', 'name').lean();
        return JSON.parse(JSON.stringify(feedback));
    } catch (error: any) {
        handleDbError(error, 'getAllFeedback');
        return [];
    }
}

export async function searchProducts(query: string): Promise<Product[]> {
    if (!isDbConfigured) {
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        return initialProducts.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery) || 
            p.description.toLowerCase().includes(lowerCaseQuery)
        );
    }
    if (!query) return [];
    try {
        await dbConnect();
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ]
        }).lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error: any) {
        handleDbError(error, `searchProducts (query: ${query})`);
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        return initialProducts.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery) || 
            p.description.toLowerCase().includes(lowerCaseQuery)
        );
    }
}
