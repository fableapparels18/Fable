import { NextResponse } from 'next/server';
import { getNewProducts } from '@/lib/data';

export async function GET() {
  try {
    const newProducts = await getNewProducts();
    return NextResponse.json(newProducts);
  } catch (error) {
    console.error('Error fetching new products:', error);
    return NextResponse.json({ message: 'Error fetching new products' }, { status: 500 });
  }
}
