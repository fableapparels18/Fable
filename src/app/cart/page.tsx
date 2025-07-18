
'use client';

import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import type { Product } from '@/models/Product';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PopulatedCartItem {
  productId: Product;
  quantity: number;
  size: string;
}

interface CartData {
  items: PopulatedCartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cart');
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401) {
            router.push('/login');
            return;
        }
        throw new Error(errorData.message || 'Failed to fetch cart');
      }
      const data = await res.json();
      setCart(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch your cart. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: string, size: string, quantity: number) => {
    try {
        let res;
        if (quantity < 1) {
            // Use the removeItem handler if quantity is zero or less
            return handleRemoveItem(productId, size);
        } else {
             res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, size, quantity }),
            });
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update quantity');
        }

        const data = await res.json();
        setCart(data);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Could not update item quantity.',
        });
    }
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size }),
      });
      if (!res.ok) throw new Error('Failed to remove item');
      const data = await res.json();
      setCart(data);
      toast({
        title: 'Item Removed',
        description: 'The item has been removed from your cart.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not remove item from cart.',
      });
    }
  };
  
  const subtotal = cart?.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-4xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <Card key={`${item.productId._id}-${item.size}`} className="overflow-hidden">
              <CardContent className="flex items-center gap-6 p-4">
                <div className="relative h-32 w-32 flex-shrink-0">
                  {hasCloudName && item.productId.images.length > 0 ? (
                      <CldImage
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        fill
                        crop="fill"
                        gravity="auto"
                        className="rounded-md object-cover"
                      />
                  ) : (
                      <Image
                        src="https://placehold.co/128x128.png"
                        alt={item.productId.name}
                        width={128}
                        height={128}
                        className="rounded-md object-cover"
                      />
                  )}
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.productId._id}`} className="font-semibold text-lg hover:underline">{item.productId.name}</Link>
                  <p className="text-muted-foreground">Size: {item.size}</p>
                  <p className="font-bold text-lg mt-2">Rs {item.productId.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center border rounded-md">
                     <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleUpdateQuantity(item.productId._id, item.size, item.quantity - 1)}>
                       <Minus className="h-4 w-4" />
                     </Button>
                     <p className="w-10 text-center font-medium">{item.quantity}</p>
                     <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleUpdateQuantity(item.productId._id, item.size, item.quantity + 1)}>
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   <Button variant="outline" size="icon" onClick={() => handleRemoveItem(item.productId._id, item.size)}>
                     <Trash2 className="h-4 w-4 text-destructive" />
                     <span className="sr-only">Remove item</span>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
               <Button size="lg" className="w-full button-fill-up" asChild>
                <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
