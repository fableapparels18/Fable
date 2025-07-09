'use client';

import { useMemo } from 'react';
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

    const selectedCategories = useMemo(() => searchParams.get('categories')?.split(',').filter(Boolean) || [], [searchParams]);
    const sortOption = useMemo(() => searchParams.get('sort') || 'date-desc', [searchParams]);

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
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filteredAndSortedProducts = useMemo(() => {
        let products = [...initialProducts];

        if (selectedCategories.length > 0) {
            products = products.filter(product => selectedCategories.includes(product.category));
        }

        products.sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'date-desc':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return products;
    }, [initialProducts, selectedCategories, sortOption]);

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

            {filteredAndSortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredAndSortedProducts.map(product => (
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
