'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/admin/logout', { method: 'POST' });
            if (res.ok) {
                toast({ title: 'Success', description: 'You have been logged out.' });
                router.push('/admin/login');
                router.refresh();
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to log out. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Logging out...' : 'Log out'}
        </Button>
    )
}
