import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from './product-card';
import type { Product } from '@/lib/data';

type ProductCarouselProps = {
  title: string;
  products: Product[];
};

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  if (products.length === 0) {
    return (
        <section className="container mx-auto px-4 md:px-6">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
                <p className="mt-4 animate-pulse text-muted-foreground">Coming Soon...</p>
            </div>
        </section>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="group md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
