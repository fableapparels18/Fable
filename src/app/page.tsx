
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { generateSlogan } from '@/ai/flows/generate-slogan';
import { getNewProducts, getTrendingProducts } from '@/lib/data';
import type { Product } from '@/models/Product';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/product-carousel';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'Half Sleeves', href: '/products?categories=Half+Sleeves', image: '/images/half.png', hint: 'oversized tshirt' },
  { name: 'Full Sleeves', href: '/products?categories=Full+Sleeves', image: '/images/fullsleev.npg', hint: 'long sleeve shirt' },
  { name: 'Hoodies', href: '/products?categories=Hoodie', image: '/images/hoody.png', hint: 'fashion hoodie' },
  { name: 'Sweatshirts', href: '/products?categories=Sweatshirt', image: '/images/sweatshirt.png', hint: 'sweatshirt model' },
];

async function Hero() {
  let slogan = 'Only 10 people will ever wear this design. Be one of them.';
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    try {
      const sloganData = await generateSlogan({ brandName: 'Fable' });
      slogan = sloganData.slogan || slogan;
    } catch (error) {
      console.error('Slogan generation failed, falling back to default slogan.', error);
    }
  }

  return (
    <section className="relative group w-full h-[60vh] md:h-[90vh] text-white">
      <Image
        src="/images/banner.png"
        alt="Fable banner"
        fill
        className="object-contain"
        priority
        data-ai-hint="fashion banner"
      />
      <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          You Blink, You Miss
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

function TrendingProductsSection({ products }: { products: Product[] }) {
  if (products.length < 3) {
    return (
      <ProductCarousel
        title="Trending Now"
        subtitle="Discover our most popular and talked-about pieces, loved by the community."
        products={products}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="border rounded-lg p-6 md:p-10">
        <div className="mb-10 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trending Now</h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Discover our most popular and talked-about pieces, loved by the community.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="w-full h-full">
            <ProductCard product={products[0]} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <ProductCard product={products[1]} />
            <ProductCard product={products[2]} />
          </div>
        </div>
      </div>
    </div>
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
      <section id="trending" className="bg-muted/50 py-16 md:py-24">
        <TrendingProductsSection products={trendingProducts} />
      </section>
      <section className="py-16 md:py-24">
        <Categories />
      </section>
      <section id="new-releases" className="bg-background py-16 md:py-24">
        <ProductCarousel 
          title="New Releases" 
          subtitle="Fresh from our design studio. Be the first to wear the future of fashion."
          products={newProducts} 
        />
      </section>
    </div>
  );
}
