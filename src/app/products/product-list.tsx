
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { SortOptions } from './sort-options';
import { ProductFilters } from './product-filters';

type ProductListProps = {
    initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

    const handleCategoryChange = (category: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        let currentCategories = params.get('categories')?.split(',').filter(Boolean) || [];
        
        if (checked) {
            if (!currentCategories.includes(category)) {
                currentCategories.push(category);
            }
        } else {
            currentCategories = currentCategories.filter(c => c !== category);
        }

        if (currentCategories.length > 0) {
            params.set('categories', currentCategories.join(','));
        } else {
            params.delete('categories');
        }
        
        // Use router.replace to avoid adding to history stack for filter changes
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            
            <ProductFilters 
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />

            {initialProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {initialProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96">
                    <h2 className="text-xl font-semibold">No Products Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        Try adjusting your filters or check back later.
                    </p>
                </div>
            )}
        </div>
    );
}
