'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Star, ImageIcon, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import AdminLogoutButton from '@/app/admin/dashboard/logout-button';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/feedback', label: 'Feedback', icon: Star },
    { href: '/admin/banner', label: 'Banner', icon: ImageIcon },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
            <div className="flex h-16 shrink-0 items-center border-b px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package className="h-6 w-6" />
                    <span>Fable Admin</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <Button
                        key={item.label}
                        variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Link>
                    </Button>
                ))}
            </nav>
            <div className="mt-auto p-4">
                 <AdminLogoutButton />
            </div>
        </aside>
    );
}
