
'use client';

import { CldImage } from 'next-cloudinary';
import { format } from 'date-fns';
import type { IOrder, OrderItem } from '@/models/Order';
import type { IAddress } from '@/models/User';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderActions } from './order-actions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, Mail, Phone, User } from 'lucide-react';


function OrderDetails({ items, shippingAddress, user }: { items: OrderItem[], shippingAddress: IAddress, user: IOrder['userId']}) {
    const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return (
        <div className="grid gap-6 md:grid-cols-2 p-4">
             <div className="space-y-4">
                <h4 className="font-semibold text-lg">Items</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(item => (
                             <TableRow key={item.productId.toString() + item.size}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="relative h-12 w-12 flex-shrink-0">
                                            {hasCloudName && item.image ? (
                                                <CldImage src={item.image} alt={item.name} width={48} height={48} crop="fill" gravity="auto" className="rounded-sm object-cover" />
                                            ) : (
                                                 <Image src="https://placehold.co/48x48.png" alt={item.name} width={48} height={48} className="rounded-sm object-cover" />
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Size: {item.size}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">Rs {item.price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="space-y-6">
                 <div>
                    <h4 className="font-semibold text-lg mb-2">Customer Details</h4>
                    {typeof user === 'object' && user !== null && (
                        <Card>
                            <CardContent className="pt-6 space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone}</span>
                                </div>
                                {user.email && (
                                     <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                 </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2">Shipping Address</h4>
                    <Card>
                        <CardContent className="pt-6 text-sm">
                            <div className="flex items-start gap-3">
                                <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                                <div className="text-muted-foreground">
                                    <p className="font-medium text-foreground">{shippingAddress.name}</p>
                                    <p>{shippingAddress.line1}</p>
                                    {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                    <p>{shippingAddress.country}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}


function OrdersTable({ orders }: { orders: IOrder[] }) {
    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No orders found.</p>
    }
    
    return (
        <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
                 <AccordionItem value={order._id.toString()} key={order._id.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="w-full flex justify-between items-center text-sm p-2 hover:bg-muted/50 rounded-md">
                           <div className="font-mono text-xs text-muted-foreground flex-1 text-left">
                                #{order._id.toString().slice(-6).toUpperCase()}
                            </div>
                            <div className="hidden sm:block flex-1 text-left font-medium">
                                {format(new Date(order.createdAt), "dd MMM yyyy")}
                            </div>
                            <div className="flex-1 text-right font-medium">Rs {order.totalAmount.toFixed(2)}</div>
                             <div className="flex-1 text-right">
                                 <Badge variant={
                                    order.status === 'Cancelled' ? 'destructive' :
                                    order.status === 'Delivered' ? 'default' :
                                    order.status === 'Pending' ? 'secondary' :
                                    'outline'
                                }>{order.status}</Badge>
                            </div>
                            <div className="flex-shrink-0 w-16 text-right">
                                {(order.status === 'Pending' || order.status === 'Out for Delivery') && <OrderActions orderId={order._id.toString()} />}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <OrderDetails 
                            items={order.items}
                            shippingAddress={order.shippingAddress}
                            user={order.userId}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

interface OrdersTabsProps {
    pendingOrders: IOrder[];
    completedOrders: IOrder[];
    cancelledOrders: IOrder[];
}

export function OrdersTabs({ pendingOrders, completedOrders, cancelledOrders }: OrdersTabsProps) {
    return (
        <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Orders</CardTitle>
                        <CardDescription>These are orders that need to be processed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable orders={pendingOrders} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="completed">
                    <Card>
                    <CardHeader>
                        <CardTitle>Recent Completed Orders</CardTitle>
                        <CardDescription>The last 30 orders that have been delivered.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable orders={completedOrders} />
                    </CardContent>
                </Card>
            </TabsContent>
                <TabsContent value="cancelled">
                    <Card>
                    <CardHeader>
                        <CardTitle>Recent Cancelled Orders</CardTitle>
                        <CardDescription>The last 30 orders that have been cancelled.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable orders={cancelledOrders} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
