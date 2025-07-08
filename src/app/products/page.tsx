import { getAllProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { SortOptions } from './sort-options';

type ProductsPageProps = {
    searchParams: {
        sort?: string;
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const sort = searchParams.sort;
    const products: Product[] = await getAllProducts(sort);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight">
                        All Products
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Explore our complete collection of modern apparel.
                    </p>
                </div>
                <SortOptions />
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                    <h2 className="text-xl font-semibold">No Products Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        There are currently no products available. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
}
