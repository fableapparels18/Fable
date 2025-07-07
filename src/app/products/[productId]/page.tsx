'use client';

import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { SizeSelector } from '@/components/size-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/models/Product';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductById(params.productId);
      setProduct(fetchedProduct);
    };
    fetchProduct();
  }, [params.productId]);

  if (!product) {
    // You can return a loading skeleton here
    return <div>Loading...</div>;
  }
  
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Please select a size before adding to cart.',
      });
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          size: selectedSize,
          quantity: 1,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      toast({
        title: 'Success!',
        description: `"${product.name}" has been added to your cart.`,
      });

    } catch (error: any) {
        if(error.message.includes("Unauthorized")) {
             toast({
                variant: 'destructive',
                title: 'Please Log In',
                description: 'You must be logged in to add items to your cart.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Something went wrong. Please try again.',
            });
        }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <ProductImageGallery images={product.images} productName={product.name} />
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{product.name}</h1>
            <p className="mt-2 text-3xl font-medium text-foreground">${product.price.toFixed(2)}</p>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Size</h2>
            <SizeSelector 
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isAdding || !selectedSize}>
              <ShoppingCart className="mr-2" /> 
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="secondary" className="flex-1">
              Buy Now
            </Button>
            <Button size="icon" variant="outline">
              <Heart />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fabric & Care</h3>
            <p className="text-muted-foreground">{product.fabricAndCare}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
