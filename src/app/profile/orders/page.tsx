'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { IOrder } from '@/models/Order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

function OrderItem({ order }: { order: IOrder }) {
    return (
        <AccordionItem value={order._id.toString()}>
            <AccordionTrigger>
                <div className="flex justify-between w-full pr-4 text-sm text-left">
                    <div className="flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground">ORDER #{order._id.toString().slice(-6).toUpperCase()}</span>
                        <span className="font-medium">{format(new Date(order.createdAt), "MMMM dd, yyyy")}</span>
                    </div>
                     <div className="hidden md:flex flex-col text-left">
                        <span className="text-muted-foreground">TOTAL</span>
                        <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                         <span className="text-muted-foreground">STATUS</span>
                         <Badge variant={
                            order.status === 'Cancelled' ? 'destructive' :
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Pending' ? 'secondary' :
                            'outline'
                        } className="mt-1 w-fit self-end">{order.status}</Badge>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.productId.toString() + item.size} className="flex items-center gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="rounded-md object-cover" />
                            </div>
                            <div className="flex-grow">
                                <Link href={`/products/${item.productId}`} className="font-semibold hover:underline">{item.name}</Link>
                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right font-medium">
                                ${item.price.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

// NOTE: This is a placeholder for a dedicated API route.
// In a real app, you would fetch this from a protected API endpoint.
async function getOrdersForCurrentUser(): Promise<IOrder[]> {
    const res = await fetch('/api/orders/user');
    if(!res.ok) return [];
    return res.json();
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            const res = await fetch('/api/orders/user');
            if (res.status === 401) {
                redirect('/login');
            }
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
          <div className="flex justify-center items-center min-h-[80vh]">
            <Loader2 className="h-16 w-16 animate-spin" />
          </div>
        );
    }
    
    return (
        <div className="bg-muted/40 flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
            <div className="flex items-center gap-4 mb-8">
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="font-headline text-3xl font-bold tracking-tight">My Orders</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View the details of your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {orders.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {orders.map(order => <OrderItem key={order._id.toString()} order={order} />)}
                        </Accordion>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        </div>
    );
}
