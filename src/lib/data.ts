import type { Product } from '@/models/Product';
import ProductModel from '@/models/Product';
import OrderModel, { type IOrder } from '@/models/Order';
import FeedbackModel, { type IFeedback } from '@/models/Feedback';
import dbConnect, { isDbConfigured } from '@/lib/mongodb';

export type { Product };

const handleDbError = (error: any, functionName: string) => {
    if (error.message.includes('bad auth')) {
        console.error(`MongoDB authentication failed in ${functionName}. Please double-check your MONGODB_URI in .env.local.`);
    } else {
        console.error(`Database error in ${functionName}: ${error.message}.`);
    }
};

export async function getTrendingProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return [];
  }
  try {
    await dbConnect();
    const products = await ProductModel.find({ isTrending: true }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getTrendingProducts');
    return [];
  }
}

export async function getNewProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return [];
  }
  try {
    await dbConnect();
    const products = await ProductModel.find({ isNew: true }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getNewProducts');
    return [];
  }
}

type GetAllProductsParams = {
  sort?: string;
  categories?: string[];
}

export async function getAllProducts({ sort, categories }: GetAllProductsParams = {}): Promise<Product[]> {
  if (!isDbConfigured) {
     return [];
  }
  try {
    await dbConnect();
    
    const filter: any = {};
    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    }

    const sortOption: { [key: string]: 1 | -1 } = {};
    switch (sort) {
        case 'price-asc':
            sortOption.price = 1;
            break;
        case 'price-desc':
            sortOption.price = -1;
            break;
        case 'name-asc':
            sortOption.name = 1;
            break;
        case 'name-desc':
            sortOption.name = -1;
            break;
        case 'date-desc':
        default:
            sortOption.createdAt = -1;
            break;
    }

    const products = await ProductModel.find(filter).sort(sortOption).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleDbError(error, 'getAllProducts');
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  if (!isDbConfigured) {
    return null;
  }
  try {
    await dbConnect();
    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      return null;
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    handleDbError(error, `getProductById (ID: ${productId})`);
    return null;
  }
}

export async function getPendingOrders(): Promise<IOrder[]> {
    if (!isDbConfigured) {
        return [];
    }
    try {
        await dbConnect();
        const orders = await OrderModel.find({ status: { $in: ['Pending', 'Out for Delivery'] } })
            .sort({ createdAt: -1 })
            .populate('userId', 'name phone email')
            .lean();
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
        const orders = await OrderModel.find({ status: 'Delivered' })
            .sort({ updatedAt: -1 })
            .limit(30)
            .populate('userId', 'name phone email')
            .lean();
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
        const orders = await OrderModel.find({ status: 'Cancelled' })
            .sort({ updatedAt: -1 })
            .limit(30)
            .populate('userId', 'name phone email')
            .lean();
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
    if (!isDbConfigured || !query) {
        return [];
    }
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
        return [];
    }
}
