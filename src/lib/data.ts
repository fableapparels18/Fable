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
    await dbConnect();
    try {
        const count = await ProductModel.countDocuments();
        if (count === 0) {
            console.log('No products found. Seeding database...');
            await ProductModel.insertMany(initialProducts);
            console.log('Database seeded with initial products.');
        }
        seeded = true;
    } catch (e) {
        console.error("Failed to seed database. Have you configured your MONGODB_URI?", e);
        seeded = true; // prevent re-seeding attempts
    }
}

export async function getTrendingProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts.filter((p) => p.isTrending);
  }
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({ isTrending: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getNewProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts.filter((p) => p.isNew);
  }
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({ isNew: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isDbConfigured) {
    return initialProducts;
  }
  await dbConnect();
  await seedProducts();
  const products = await ProductModel.find({}).lean();
  return JSON.parse(JSON.stringify(products));
}
