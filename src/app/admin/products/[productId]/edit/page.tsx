
'use client';

import { notFound, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import type { Product } from '@/models/Product';
import { getProductById } from '@/lib/data';
import { ProductFormSchema, ProductFormData } from '@/lib/schemas';
import { updateProduct } from '../../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUploader } from '../../image-uploader';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
const CATEGORIES = ['Oversized', 'Hoodie', 'Full Sleeves', 'Half Sleeves', 'Sweatshirt'] as const;

type EditProductPageProps = {
    params: { productId: string };
};

export default function EditProductPage({ params }: EditProductPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoadingProduct(true);
            const fetchedProduct = await getProductById(params.productId);
            if (!fetchedProduct) {
                notFound();
            }
            setProduct(fetchedProduct);
            setIsLoadingProduct(false);
        };
        fetchProduct();
    }, [params.productId]);

    if (isLoadingProduct || !product) {
        return <EditProductFormSkeleton />;
    }
    
    return <EditProductForm product={product} />;
}


function EditProductForm({ product }: { product: Product }) {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ProductFormData>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            ...product,
            images: product.images.join(', '),
            details: product.details.join('\n'),
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        const result = await updateProduct(product._id, data);
        if (result?.message) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: result.message,
            });
        } else {
             toast({
                title: 'Success!',
                description: 'Product has been updated successfully.',
            });
        }
    };
    
    const isLoading = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">Editing: <span className="font-semibold">{product.name}</span></p>
                </header>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>Basic information about the product.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Monochrome Echo Tee" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A comfortable oversized tee with a subtle, echoing monochrome graphic." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Specifics</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="100% premium cotton&#10;Oversized fit&#10;Dropped shoulders" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter each detail on a new line.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fabricAndCare"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fabric & Care</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Machine wash cold, tumble dry low. Do not bleach. Iron on low heat." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <ImageUploader />
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Category</CardTitle>
                            </CardHeader>
                             <CardContent className="grid gap-6">
                                 <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="34.99" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CATEGORIES.map(category => (
                                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Available Sizes</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <FormField
                                    control={form.control}
                                    name="sizes"
                                    render={() => (
                                        <FormItem className="space-y-3">
                                        {SIZES.map((size) => (
                                            <FormField
                                                key={size}
                                                control={form.control}
                                                name="sizes"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem key={size} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(size)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), size])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== size
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {size}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                         <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                             </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                             <CardContent className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="isTrending"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Trending</FormLabel>
                                                <FormDescription>Mark this product as trending.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isNew"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>New Release</FormLabel>
                                                <FormDescription>Mark this product as a new release.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                             </CardContent>
                        </Card>

                    </div>
                    <div className="lg:col-span-3 flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

function EditProductFormSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7 rounded-md" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-48 rounded-md" />
                    <Skeleton className="h-5 w-64 rounded-md" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3 rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </CardHeader>
                        <CardContent className="grid gap-6">
                           <Skeleton className="h-16 w-full rounded-md" />
                           <Skeleton className="h-24 w-full rounded-md" />
                           <Skeleton className="h-24 w-full rounded-md" />
                           <Skeleton className="h-24 w-full rounded-md" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3 rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full rounded-md" />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                        </CardHeader>
                         <CardContent className="grid gap-6">
                           <Skeleton className="h-10 w-full rounded-md" />
                           <Skeleton className="h-10 w-full rounded-md" />
                         </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                        </CardHeader>
                         <CardContent className="grid gap-4">
                            <Skeleton className="h-10 w-full rounded-md" />
                             <Skeleton className="h-10 w-full rounded-md" />
                              <Skeleton className="h-10 w-full rounded-md" />
                               <Skeleton className="h-10 w-full rounded-md" />
                         </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                        </CardHeader>
                         <CardContent className="grid gap-4">
                           <Skeleton className="h-16 w-full rounded-md" />
                           <Skeleton className="h-16 w-full rounded-md" />
                         </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-3 flex justify-end">
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
            </div>
        </div>
    );
}
