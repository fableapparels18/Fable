import type { Product } from '@/models/Product';
import ProductModel from '@/models/Product';
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

export async function getTrendingProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts.filter((p) => p.isTrending);
  }
  try {
    await seedProducts();
    const products = await ProductModel.find({ isTrending: true }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.error(`Database error in getTrendingProducts: ${error.message}. Falling back to static data. Please check your MONGODB_URI.`);
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
    console.error(`Database error in getNewProducts: ${error.message}. Falling back to static data. Please check your MONGODB_URI.`);
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
    console.error(`Database error in getAllProducts: ${error.message}. Falling back to static data. Please check your MONGODB_URI.`);
    return initialProducts;
  }
}
