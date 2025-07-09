'use client';

import { Menu, Search, ShoppingCart, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '#', label: 'Trending' },
  { href: '#', label: 'New Releases' },
];

export function Header() {
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q') as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSheetOpen(false);
      setSearchOpen(false);
    }
  };


  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold">FableFront</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
               <motion.div key={link.label} className="relative">
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ transformOrigin: 'center' }}
                />
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" name="q" placeholder="Search products..." className="w-full pl-9" />
          </form>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/dashboard">
              <Shield className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Link>
          </Button>
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
            <Sheet key="search-sheet" open={isSearchOpen} onOpenChange={setSearchOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Search className="h-6 w-6" />
                        <span className="sr-only">Search</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="p-4">
                     <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            name="q"
                            type="search"
                            placeholder="Search products..."
                            className="w-full h-12 pl-10 text-lg"
                            autoFocus
                        />
                    </form>
                </SheetContent>
            </Sheet>

            <Sheet key="menu-sheet" open={isSheetOpen} onOpenChange={setSheetOpen}>
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
                <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <motion.div key={link.label} className="relative">
                        <Link
                            href={link.href}
                            onClick={() => setSheetOpen(false)}
                            className="block text-lg font-medium"
                        >
                            {link.label}
                        </Link>
                      </motion.div>
                    ))}
                </nav>
                 <div className="flex items-center gap-4 border-t pt-6">
                    <Button variant="ghost" size="icon" className="w-auto px-2 justify-start gap-2" asChild>
                        <Link href="/admin/dashboard" onClick={() => setSheetOpen(false)}>
                            <Shield className="h-5 w-5" />
                            <span>Admin</span>
                        </Link>
                    </Button>
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
    </motion.header>
  );
}
