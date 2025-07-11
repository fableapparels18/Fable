'use client';

import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import type { Product } from '@/models/Product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteProductButton } from './delete-product-button';
import Image from 'next/image';

export function ProductsTable({ products }: { products: Product[] }) {
    const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return (
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
                           {hasCloudName && product.images.length > 0 ? (
                                <CldImage
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={product.images[0]}
                                    width="64"
                                    crop="fill"
                                    gravity="auto"
                                />
                            ) : (
                                <Image
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="https://placehold.co/64x64.png"
                                    width="64"
                                />
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                            {product.isNew && <Badge variant="outline">New</Badge>}
                            {product.isTrending && <Badge variant="secondary">Trending</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="hidden md:table-cell">Rs {product.price.toFixed(2)}</TableCell>
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
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product._id}/edit`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DeleteProductButton productId={product._id} productName={product.name} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
