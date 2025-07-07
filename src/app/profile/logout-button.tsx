'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function LogoutButton() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                toast({ title: 'Success', description: 'You have been logged out.' });
                router.push('/');
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
        <Button onClick={handleLogout} variant="destructive" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Log out'}
        </Button>
    )
}
