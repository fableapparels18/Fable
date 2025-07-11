
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { format } from 'date-fns';
import type { IOrder } from '@/models/Order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Home } from 'lucide-react';
import Image from 'next/image';

function OrderItem({ order }: { order: IOrder }) {
    const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Items</h4>
                        {order.items.map(item => (
                            <div key={item.productId.toString() + item.size} className="flex items-center gap-4">
                                <div className="relative h-20 w-20 flex-shrink-0">
                                    {hasCloudName ? (
                                        <CldImage src={item.image} alt={item.name} fill crop="fill" gravity="auto" className="rounded-md object-cover" />
                                    ) : (
                                        <Image src="https://placehold.co/80x80.png" alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                                    )}
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
                    <div>
                        <h4 className="font-semibold">Shipping Address</h4>
                        <div className="mt-2 text-sm text-muted-foreground">
                            <p>{order.shippingAddress.line1}</p>
                            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/orders/user');
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    throw new Error('Failed to fetch orders');
                }
            } catch (error) {
                // Handle toast notification if desired
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [router]);

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
