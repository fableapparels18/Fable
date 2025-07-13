import type { Metadata } from 'next';
import { getNewProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'New Releases - Fable',
    description: 'Fresh from our design studio. Be the first to wear the future of fashion.',
};

export default async function NewReleasesPage() {
    const products: Product[] = await getNewProducts();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    New Releases
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Fresh from our design studio. Be the first to wear the future of fashion.
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
                    <h2 className="text-xl font-semibold">No New Releases Yet</h2>
                    <p className="mt-2 text-muted-foreground">
                        Exciting new designs are coming soon. Stay tuned!
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
