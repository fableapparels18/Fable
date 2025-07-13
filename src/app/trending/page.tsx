import type { Metadata } from 'next';
import { getTrendingProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Trending Now - Fable',
    description: 'Discover our most popular and talked-about pieces.',
};

export default async function TrendingPage() {
    const products: Product[] = await getTrendingProducts();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Trending Now
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover our most popular and talked-about pieces, loved by the community.
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96">
                    <h2 className="text-xl font-semibold">No Trending Products</h2>
                    <p className="mt-2 text-muted-foreground">
                        Check back later to see what's popular!
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
