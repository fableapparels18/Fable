import { getAllProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductList } from './product-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Products - Fable',
    description: 'Explore our complete collection of modern apparel.',
};

type ProductsPageProps = {
    searchParams?: {
        sort?: string;
        categories?: string;
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const sort = searchParams?.sort;
    const categories = searchParams?.categories?.split(',');
    
    const products: Product[] = await getAllProducts({ sort, categories });

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <ProductList initialProducts={products} />
        </div>
    );
}
