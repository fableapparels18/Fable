import { searchProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type SearchPageProps = {
    searchParams: {
        q?: string;
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || '';
    const products: Product[] = await searchProducts(query);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Search Results
                </h1>
                {query ? (
                    <p className="mt-2 text-lg text-muted-foreground">
                        {products.length} result{products.length === 1 ? '' : 's'} for <span className="font-semibold text-foreground">"{query}"</span>
                    </p>
                ) : (
                    <p className="mt-2 text-lg text-muted-foreground">
                        Please enter a search term to find products.
                    </p>
                )}
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                query && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                        <h2 className="text-xl font-semibold">No Products Found</h2>
                        <p className="mt-2 text-muted-foreground">
                            We couldn't find any products matching your search. Try a different keyword.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                )
            )}
        </div>
    );
}
