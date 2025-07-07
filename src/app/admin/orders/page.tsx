import Image from 'next/image';
import { format } from 'date-fns';
import { getPendingOrders, getRecentCompletedOrders } from '@/lib/data';
import type { IOrder } from '@/models/Order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderActions } from './order-actions';
import { Badge } from '@/components/ui/badge';


function OrdersTable({ orders, isPending }: { orders: IOrder[], isPending?: boolean }) {
    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No orders found.</p>
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order._id.toString()}>
                        <TableCell className="font-mono text-xs">{order._id.toString()}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-2">
                                {order.items.map(item => (
                                    <div key={item.productId.toString() + item.size} className="flex items-center gap-2">
                                        <div className="relative h-10 w-10 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="rounded-sm object-cover" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity} | Size: {item.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell><Badge variant={order.status === 'Pending' ? 'secondary' : 'outline'}>{order.status}</Badge></TableCell>
                        <TableCell>
                            {(order.status === 'Pending' || order.status === 'Out for Delivery') && <OrderActions orderId={order._id.toString()} />}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default async function AdminOrdersPage() {
    const pendingOrders = await getPendingOrders();
    const completedOrders = await getRecentCompletedOrders();

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage and track customer orders.</p>
            </header>

             <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                    <TabsTrigger value="completed">Completed Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Orders</CardTitle>
                            <CardDescription>These are orders that need to be processed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={pendingOrders} isPending={true} />
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
            </Tabs>
        </div>
    );
}
