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
          <p className="text-center md:text-left">Contemporary apparel for the modern storyteller.</p>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <h3 className="font-headline text-lg font-semibold text-foreground">Contact Us</h3>
          <a href="mailto:support@fable.com" className="flex items-center gap-2 hover:text-primary">
            <Mail className="h-4 w-4" />
            support@fable.com
          </a>
          <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary">
            <Phone className="h-4 w-4" />
            +1 (234) 567-890
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <h3 className="font-headline text-lg font-semibold text-foreground">Follow Us</h3>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
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
