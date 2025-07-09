import { getAllProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductList } from './product-list';

export default async function ProductsPage() {
    // Fetch all products on the server. Client component will handle filtering and sorting.
    const products: Product[] = await getAllProducts();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <ProductList initialProducts={products} />
        </div>
    );
}
