import { NextResponse } from 'next/server';
import { getTrendingProducts } from '@/lib/data';

export async function GET() {
  try {
    const trendingProducts = await getTrendingProducts();
    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return NextResponse.json({ message: 'Error fetching trending products' }, { status: 500 });
  }
}
