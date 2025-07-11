'use client';

import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/models/Product';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product._id}`} className="aspect-[4/5] overflow-hidden">
          {hasCloudName && product.images.length > 0 ? (
              <CldImage
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={500}
                crop="fill"
                gravity="auto"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
          ) : (
              <Image
                src={'https://placehold.co/400x500.png'}
                alt={product.name}
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
          )}
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-lg font-medium">
            <Link href={`/products/${product._id}`} className="hover:text-primary transition-colors">
                {product.name}
            </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-foreground">Rs {product.price.toFixed(2)}</p>
        <Button asChild size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/products/${product._id}`}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
