import { getPendingOrders, getRecentCompletedOrders, getRecentCancelledOrders } from '@/lib/data';
import { OrdersTabs } from './orders-tabs';

export default async function AdminOrdersPage() {
    const pendingOrders = await getPendingOrders();
    const completedOrders = await getRecentCompletedOrders();
    const cancelledOrders = await getRecentCancelledOrders();

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage and track customer orders.</p>
            </header>

            <OrdersTabs
                pendingOrders={pendingOrders}
                completedOrders={completedOrders}
                cancelledOrders={cancelledOrders}
            />
        </div>
    );
}
