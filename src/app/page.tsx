import Image from 'next/image';
import Link from 'next/link';

import { generateSlogan } from '@/ai/flows/generate-slogan';
import { getNewProducts, getTrendingProducts, type Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/product-carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Oversized', href: '#', image: 'https://placehold.co/400x500.png', data_ai_hint: 'oversized tshirt' },
  { name: 'Hoodies', href: '#', image: 'https://placehold.co/400x500.png', data_ai_hint: 'hoodie fashion' },
  { name: 'Full Sleeves', href: '#', image: 'https://placehold.co/400x500.png', data_ai_hint: 'long sleeve' },
  { name: 'Sweatshirts', href: '#', image: 'https://placehold.co/400x500.png', data_ai_hint: 'sweatshirt style' },
];

async function Hero() {
  let slogan = 'Wear Your Story.';
  try {
    const sloganData = await generateSlogan({ brandName: 'Fable Apparels' });
    slogan = sloganData.slogan || slogan;
  } catch (error) {
    console.error('Slogan generation failed, falling back to default slogan.', error);
  }

  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto grid min-h-[60dvh] grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:min-h-[70dvh]">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            FableFront
          </h1>
          <p className="font-headline animate-pulse text-lg text-primary-foreground/80 md:text-xl">
            {slogan}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#">
              Shop The Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full w-full items-center justify-center md:flex">
          <Image
            src="https://placehold.co/600x700.png"
            alt="FableFront Hero Image"
            width={600}
            height={700}
            className="rounded-lg object-cover shadow-2xl"
            data-ai-hint="fashion model"
          />
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container mx-auto px-4 md:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Shop by Category</h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
          Find your perfect fit from our curated collections.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
        {categories.map((category) => (
          <Link href={category.href} key={category.name} className="group relative overflow-hidden rounded-lg">
            <Image
              src={category.image}
              alt={`Category ${category.name}`}
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={category.data_ai_hint}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-headline text-2xl font-bold text-white">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


export default async function Home() {
  const trendingProducts: Product[] = await getTrendingProducts();
  const newProducts: Product[] = await getNewProducts();

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="space-y-16 py-12 md:space-y-24 md:py-20">
        <ProductCarousel title="Trending Now" products={trendingProducts} />
        <Categories />
        <ProductCarousel title="New Releases" products={newProducts} />
      </div>
    </div>
  );
}
