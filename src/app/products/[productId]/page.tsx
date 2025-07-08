
import { getProductById, getFeedbackByProductId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductClientPage } from './product-client-page';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

function ProductPageSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6 animate-pulse">
            <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    <div className="bg-muted aspect-square rounded-lg"></div>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="bg-muted aspect-square rounded-md h-20"></div>
                        <div className="bg-muted aspect-square rounded-md h-20"></div>
                        <div className="bg-muted aspect-square rounded-md h-20"></div>
                        <div className="bg-muted aspect-square rounded-md h-20"></div>
                         <div className="bg-muted aspect-square rounded-md h-20"></div>
                    </div>
                </div>
                {/* Product Info Skeleton */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <div className="h-12 w-3/4 bg-muted rounded"></div>
                        <div className="mt-2 h-8 w-1/4 bg-muted rounded"></div>
                        <div className="mt-4 space-y-2">
                            <div className="h-4 w-full bg-muted rounded"></div>
                            <div className="h-4 w-5/6 bg-muted rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-6 w-16 bg-muted rounded"></div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-muted rounded-md"></div>
                            <div className="h-10 w-10 bg-muted rounded-md"></div>
                            <div className="h-10 w-10 bg-muted rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 flex-1 bg-muted rounded-md"></div>
                        <div className="h-12 flex-1 bg-muted rounded-md"></div>
                        <div className="h-12 w-12 bg-muted rounded-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function ProductPageContent({ productId }: { productId: string }) {
    const [product, feedback] = await Promise.all([
        getProductById(productId),
        getFeedbackByProductId(productId)
    ]);

    if (!product) {
        notFound();
    }

    return <ProductClientPage productId={productId} initialProduct={product} initialFeedback={feedback} />;
}

export default function ProductPage({ params }: ProductPageProps) {
    return (
        <Suspense fallback={<ProductPageSkeleton />}>
            <ProductPageContent productId={params.productId} />
        </Suspense>
    );
}
