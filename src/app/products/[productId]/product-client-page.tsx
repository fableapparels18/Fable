
'use client';

import { useRouter } from 'next/navigation';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { SizeSelector } from '@/components/size-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/models/Product';
import type { IFeedback } from '@/models/Feedback';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormSchema, type FeedbackFormData } from '@/lib/schemas';
import { addFeedback } from '@/app/feedback/actions';
import { StarRating } from '@/components/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';


function FeedbackForm({ productId, onFeedbackSubmitted, isLoggedIn }: { productId: string, onFeedbackSubmitted: () => void, isLoggedIn: boolean }) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    if (!isLoggedIn) {
        toast({
            variant: 'destructive',
            title: 'Please Log In',
            description: 'You must be logged in to leave a review.',
            action: <Button onClick={() => router.push('/login')}>Login</Button>
        });
        return;
    }
    const result = await addFeedback(productId, data);
    if (result?.success) {
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback.',
      });
      form.reset();
      onFeedbackSubmitted();
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: result?.message || 'Could not submit your review.',
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        {isLoggedIn ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} onRate={field.onChange} size={24} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your thoughts on this product..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="button-fill-up">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
        ) : (
             <div className="text-center">
                <p className="text-muted-foreground mt-2">Please log in to leave a review.</p>
                <Button asChild className="mt-4">
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}


function FeedbackList({ feedback }: { feedback: IFeedback[] }) {
    if (feedback.length === 0) {
        return <p className="text-muted-foreground py-8 text-center">No reviews yet. Be the first to leave one!</p>
    }
    return (
        <div className="space-y-6">
            {feedback.map(fb => (
                <div key={fb._id.toString()} className="flex gap-4">
                    <div className="flex-shrink-0 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                            {fb.userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{fb.userName}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(fb.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        <StarRating rating={fb.rating} readOnly size={16} className="my-1" />
                        <p className="text-muted-foreground">{fb.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

type ProductClientPageProps = {
  productId: string;
  initialProduct: Product;
  initialFeedback: IFeedback[];
  isLoggedIn: boolean;
};

export function ProductClientPage({ productId, initialProduct: product, initialFeedback: feedback, isLoggedIn }: ProductClientPageProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { toast } = useToast();
  
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
         if (response.status === 401) {
            toast({
                variant: 'destructive',
                title: 'Please Log In',
                description: 'You must be logged in to add items to your cart.',
                action: <Button onClick={() => router.push('/login')}>Login</Button>
            });
        } else {
            throw new Error(errorData.message || 'Failed to add item to cart');
        }
      } else {
        toast({
            title: 'Success!',
            description: `"${product.name}" has been added to your cart.`,
        });
        router.refresh();
      }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'An error occurred while adding to cart.',
        });
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Please select a size first.',
      });
      return;
    }

    setIsBuying(true);
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
        if (response.status === 401) {
            toast({
                variant: 'destructive',
                title: 'Please Log In',
                description: 'You must be logged in to buy items.',
                action: <Button onClick={() => router.push('/login')}>Login</Button>
            });
        } else {
            throw new Error(errorData.message || 'Failed to add item to cart');
        }
      } else {
        router.push('/checkout');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred.',
      });
    } finally {
      setIsBuying(false);
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
            <Button size="lg" className="flex-1 button-fill-up" onClick={handleAddToCart} disabled={isAdding || isBuying || !selectedSize}>
              {isAdding ? <Loader2 className="mr-2 animate-spin" /> : <ShoppingCart className="mr-2" />}
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 button-fill-up" onClick={handleBuyNow} disabled={isAdding || isBuying || !selectedSize}>
               {isBuying && <Loader2 className="mr-2 animate-spin" />}
               {isBuying ? 'Processing...' : 'Buy Now'}
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
      
      <Separator className="my-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Customer Reviews</h2>
            <FeedbackList feedback={feedback} />
        </div>
        <div className="md:col-span-1">
            <FeedbackForm productId={productId} onFeedbackSubmitted={() => router.refresh()} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
