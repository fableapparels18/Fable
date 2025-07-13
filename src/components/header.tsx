
'use client';

import { Menu, Search, ShoppingCart, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/trending', label: 'Trending' },
  { href: '/new-releases', label: 'New Releases' },
];

const mobileNavLinks = [
  ...navLinks,
  { href: '/profile', label: 'Profile' },
  { href: '/admin/dashboard', label: 'Admin' }
]

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
            <Image src="/images/logo.png" alt="Fable Logo" width={100} height={30} data-ai-hint="logo fable" />
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
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <Sheet key="search-sheet" open={isSearchOpen} onOpenChange={setSearchOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Search className="h-6 w-6" />
                        <span className="sr-only">Search</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="p-4">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Search Products</SheetTitle>
                    </SheetHeader>
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
                <SheetHeader>
                    <SheetTitle asChild>
                         <Link href="/" onClick={() => setSheetOpen(false)} className="flex items-center">
                            <Image src="/images/logo.png" alt="Fable Logo" width={100} height={30} data-ai-hint="logo fable" />
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <nav className="mt-6 flex flex-col gap-4">
                        {mobileNavLinks.map((link) => (
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
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
