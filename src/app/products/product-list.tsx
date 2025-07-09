'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Product } from '@/models/Product';
import { ProductCard } from '@/components/product-card';
import { SortOptions } from './sort-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORIES = ['Oversized', 'Hoodie', 'Full Sleeves', 'Half Sleeves', 'Sweatshirt'] as const;

type ProductListProps = {
    initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedCategories = useMemo(() => searchParams.get('categories')?.split(',').filter(Boolean) || [], [searchParams]);
    const sortOption = useMemo(() => searchParams.get('sort') || 'date-desc', [searchParams]);

    const handleCategoryChange = (category: string, checked: boolean | 'indeterminate') => {
        const params = new URLSearchParams(searchParams.toString());
        let currentCategories = params.get('categories')?.split(',').filter(Boolean) || [];
        
        if (checked === true) {
            currentCategories.push(category);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <aside className="lg:col-span-1 lg:sticky lg:top-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {CATEGORIES.map(category => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={category} 
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                                />
                                <Label htmlFor={category} className="font-normal cursor-pointer">{category}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </aside>

            <main className="lg:col-span-3">
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
                
                {filteredAndSortedProducts.length > 0 ? (
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center col-span-full h-96">
                        <h2 className="text-xl font-semibold">No Products Found</h2>
                        <p className="mt-2 text-muted-foreground">
                            Try adjusting your filters or check back later.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
