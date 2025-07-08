'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders', { method: 'POST' });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to place order');
            }

            toast({
                title: 'Order Placed!',
                description: 'Thank you for your purchase. Your order is being processed.',
            });
            router.push('/profile');
            router.refresh();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Checkout Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button size="lg" className="w-full button-fill-up" onClick={handleCheckout} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Placing Order...' : 'Proceed to Checkout'}
        </Button>
    );
}
