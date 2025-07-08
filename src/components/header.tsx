'use client';

import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '#', label: 'Shop' },
  { href: '#', label: 'Trending' },
  { href: '#', label: 'New Releases' },
];

export function Header() {
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q') as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      // close sheet if it's open
      setSheetOpen(false);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold">FableFront</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" name="q" placeholder="Search products..." className="w-full pl-9" />
          </form>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                <Link href="/" onClick={() => setSheetOpen(false)} className="flex items-center">
                    <span className="font-headline text-xl font-bold">FableFront</span>
                </Link>
                <form onSubmit={handleSearch} className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="q" type="search" placeholder="Search products..." className="w-full pl-9" />
                </form>
                <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className="text-lg font-medium"
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
                 <div className="flex items-center gap-4 border-t pt-6">
                    <Button variant="ghost" size="icon" className="w-auto px-2 justify-start gap-2" asChild>
                        <Link href="/profile" onClick={() => setSheetOpen(false)}>
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-auto px-2 justify-start gap-2" asChild>
                         <Link href="/cart" onClick={() => setSheetOpen(false)}>
                            <ShoppingCart className="h-5 w-5" />
                            <span>Cart</span>
                        </Link>
                    </Button>
                 </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
