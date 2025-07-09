import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from './product-card';
import type { Product } from '@/models/Product';

type ProductCarouselProps = {
  title: string;
  subtitle?: string;
  products: Product[];
};

export function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
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
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">{subtitle}</p>}
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
            <CarouselItem key={product._id} className="basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
