import type { Product } from '@/models/Product';
import ProductModel from '@/models/Product';
import dbConnect from '@/lib/mongodb';
import { initialProducts } from '@/lib/initial-data';

export type { Product };

let seeded = false;
async function seedProducts() {
    if (seeded) return;
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
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({ isTrending: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getNewProducts(): Promise<Product[]> {
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({ isNew: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getAllProducts(): Promise<Product[]> {
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({}).lean();
  return JSON.parse(JSON.stringify(products));
}
