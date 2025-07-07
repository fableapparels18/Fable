import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { getAllProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="hidden md:table-cell">Price</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                            alt={product.name}
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={product.images[0]}
                                            width="64"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                                        {product.isNew && <Badge variant="outline">New</Badge>}
                                        {product.isTrending && <Badge variant="secondary">Trending</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="hidden md:table-cell">${product.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
