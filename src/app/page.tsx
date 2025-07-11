
import Image from 'next/image';
import Link from 'next/link';

import { generateSlogan } from '@/ai/flows/generate-slogan';
import { getNewProducts, getTrendingProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/product-carousel';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Oversized', href: '/products?categories=Oversized', image: '/images/oversized.jpg', hint: 'oversized tshirt' },
  { name: 'Hoodies', href: '/products?categories=Hoodie', image: '/images/hoodies.jpg', hint: 'fashion hoodie' },
  { name: 'Full Sleeves', href: '/products?categories=Full+Sleeves', image: '/images/full-sleeves.jpg', hint: 'long sleeve shirt' },
  { name: 'Sweatshirts', href: '/products?categories=Sweatshirt', image: '/images/sweatshirts.jpg', hint: 'sweatshirt model' },
];

async function Hero() {
  let slogan = 'Wear Your Story.';
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    try {
      const sloganData = await generateSlogan({ brandName: 'Fable' });
      slogan = sloganData.slogan || slogan;
    } catch (error) {
      console.error('Slogan generation failed, falling back to default slogan.', error);
    }
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
      <Image
        src="/images/banner.jpg"
        alt="Fable banner"
        fill
        className="object-cover object-center"
        priority
        data-ai-hint="fashion banner"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Fable
        </h1>
        <p className="font-headline text-lg md:text-xl mt-4 max-w-2xl">
          {slogan}
        </p>
        <Button size="lg" asChild className="mt-8 button-fill-up bg-white text-black hover:bg-gray-200">
          <Link href="/products">
            Shop The Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
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
              data-ai-hint={category.hint}
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
      <section className="bg-muted/50 py-16 md:py-24">
        <ProductCarousel 
          title="Trending Now" 
          subtitle="Discover our most popular and talked-about pieces, loved by the community."
          products={trendingProducts} 
        />
      </section>
      <section className="py-16 md:py-24">
        <Categories />
      </section>
      <section className="bg-background py-16 md:py-24">
        <ProductCarousel 
          title="New Releases" 
          subtitle="Fresh from our design studio. Be the first to wear the future of fashion."
          products={newProducts} 
        />
      </section>
    </div>
  );
}
