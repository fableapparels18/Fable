'use client';

import { notFound } from 'next/navigation';
import { getProductById, getFeedbackByProductId } from '@/lib/data';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { SizeSelector } from '@/components/size-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/models/Product';
import type { IFeedback } from '@/models/Feedback';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormSchema, type FeedbackFormData } from '@/lib/schemas';
import { addFeedback } from '../feedback/actions';
import { StarRating } from '@/components/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import jwt from 'jsonwebtoken';
import type { UserPayload } from '@/lib/auth';


type ProductPageProps = {
  params: {
    productId: string;
  };
};

function FeedbackForm({ productId, onFeedbackSubmitted }: { productId: string, onFeedbackSubmitted: () => void }) {
  const { toast } = useToast();
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
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

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<IFeedback[]>([]);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchProductAndFeedback = async () => {
      const [productData, feedbackData] = await Promise.all([
          getProductById(params.productId),
          getFeedbackByProductId(params.productId)
      ]);
      setProduct(productData);
      setFeedback(feedbackData);
  };
  
  useEffect(() => {
    // Check for user token on mount
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
        try {
            const payload = jwt.decode(token) as UserPayload;
            setUser(payload);
        } catch (e) {
            console.error("Failed to decode token", e)
        }
    }
    fetchProductAndFeedback();
  }, [params.productId]);

  if (!product) {
    // You can return a loading skeleton here
    return <div className="flex justify-center items-center min-h-[80vh]"><Loader2 className="h-16 w-16 animate-spin" /></div>;
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
      
      <Separator className="my-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Customer Reviews</h2>
            <FeedbackList feedback={feedback} />
        </div>
        <div className="md:col-span-1">
            {user ? (
                <FeedbackForm productId={params.productId} onFeedbackSubmitted={fetchProductAndFeedback} />
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-semibold">Want to share your thoughts?</h3>
                        <p className="text-muted-foreground mt-2">Please log in to leave a review.</p>
                        <Button asChild className="mt-4">
                            <a href="/login">Log In</a>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
