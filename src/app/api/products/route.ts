import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return NextResponse.json({ message: 'Error fetching all products' }, { status: 500 });
  }
}
