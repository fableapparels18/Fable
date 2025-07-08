import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { getAllProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductsTable } from './products-table';

export default async function AdminProductsPage() {
    const products: Product[] = await getAllProducts();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage all the products for Fable Apparels.</p>
                </header>
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link href="/admin/products/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>A list of all products in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductsTable products={products} />
                </CardContent>
            </Card>
        </div>
    );
}
