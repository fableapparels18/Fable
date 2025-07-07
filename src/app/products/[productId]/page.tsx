import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { SizeSelector } from '@/components/size-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.productId);
  if (!product) {
    return {
      title: 'Product not found',
    }
  }
  return {
    title: `${product.name} | FableFront`,
    description: product.description,
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId);

  if (!product) {
    notFound();
  }

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
            <SizeSelector sizes={product.sizes} />
          </div>

          <div className="flex items-center gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2" /> Add to Cart
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