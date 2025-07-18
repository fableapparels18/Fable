import { Instagram, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="font-headline text-2xl font-bold text-foreground">
             <Image src="/images/logo.png" alt="Fable Logo" width={100} height={30} data-ai-hint="logo fable" />
          </Link>
          <p className="text-center md:text-left">
            Fable Apparels is a homegrown clothing brand crafting limited-edition drops with just 10 pieces per design ever. No restocks. No second chances. Each tee is made for those who move fast, stand out, and wear their story with pride. Join the drop culture. Be the few.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <h3 className="font-headline text-lg font-semibold text-foreground">Contact Us</h3>
          <a href="mailto:fableapparels@gmail.com" className="flex items-center gap-2 hover:text-primary">
            <Mail className="h-4 w-4" />
            fableapparels@gmail.com
          </a>
          <a href="tel:+919932458933" className="flex items-center gap-2 hover:text-primary">
            <Phone className="h-4 w-4" />
            +91 99324 58933
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <h3 className="font-headline text-lg font-semibold text-foreground">Follow Us</h3>
          <a href="https://www.instagram.com/fable_apparels?igsh=bTk3cGVvbjFyNzdu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
            <Instagram className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:px-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Fable. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
