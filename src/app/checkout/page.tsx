
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Truck, Home } from 'lucide-react';
import type { IAddress, IUser } from '@/models/User';
import type { Product } from '@/models/Product';
import { AddAddressDialog } from '@/app/profile/addresses/add-address-dialog';
import { getUserWithAddresses } from '../profile/actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';


interface PopulatedCartItem {
  productId: Product;
  quantity: number;
  size: string;
}

interface CartData {
  items: PopulatedCartItem[];
}

function AddressSelector({ addresses, selectedAddress, onSelect, onAddressAdded }: { addresses: IAddress[], selectedAddress: string | null, onSelect: (id: string) => void, onAddressAdded: () => void }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>Select where to deliver your order.</CardDescription>
                </div>
                <AddAddressDialog onAddressAdded={onAddressAdded} />
            </CardHeader>
            <CardContent>
                {addresses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {addresses.map(address => (
                             <div
                                key={address._id.toString()}
                                className={cn(
                                    "rounded-lg border p-4 flex items-start gap-4 cursor-pointer transition-all",
                                    selectedAddress === address._id.toString() ? "ring-2 ring-primary bg-primary/5" : "bg-card hover:bg-muted/50"
                                )}
                                onClick={() => onSelect(address._id.toString())}
                            >
                                <Home className="h-5 w-5 mt-1 text-muted-foreground" />
                                <div className="text-sm flex-1">
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="text-muted-foreground">{address.line1}</p>
                                    {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                                    <p className="text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                                    <p className="text-muted-foreground">{address.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-8 text-muted-foreground">
                        <p>No addresses found. Please add one to continue.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function OrderSummary({ cart, total }: { cart: CartData | null, total: number }) {
    const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {cart?.items.map(item => (
                        <div key={`${item.productId._id}-${item.size}`} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0">
                                {hasCloudName && item.productId.images.length > 0 ? (
                                    <CldImage src={item.productId.images[0]} alt={item.productId.name} fill crop="fill" gravity="auto" className="rounded-md object-cover" />
                                ) : (
                                    <Image src="https://placehold.co/64x64.png" alt={item.productId.name} width={64} height={64} className="rounded-md object-cover" />
                                )}
                            </div>
                            <div className="flex-grow text-sm">
                                <p className="font-medium">{item.productId.name}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity} | Size: {item.size}</p>
                            </div>
                            <p className="font-medium text-sm">Rs {(item.productId.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                 <Separator />
                 <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs {total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Rs {total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function CheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [cart, setCart] = useState<CartData | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isPlacingOrder, startTransition] = useTransition();
    
    const fetchCheckoutData = async () => {
        setIsDataLoading(true);
        try {
            const [cartRes, userRes] = await Promise.all([
                fetch('/api/cart'),
                getUserWithAddresses()
            ]);

            if (!cartRes.ok) {
                if (cartRes.status === 401) router.push('/login');
                throw new Error('Failed to fetch cart data.');
            }
            if (!userRes) {
                router.push('/login');
                throw new Error('Failed to fetch user data.');
            }
            
            const cartData = await cartRes.json();

            setCart(cartData);
            setUser(userRes);

            // Pre-select the first address if available
            if (userRes.addresses && userRes.addresses.length > 0) {
                setSelectedAddress(userRes.addresses[0]._id.toString());
            }

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
            router.push('/cart');
        } finally {
            setIsDataLoading(false);
        }
    };

    const cartIsEmpty = !cart || cart.items.length === 0;

    useEffect(() => {
        fetchCheckoutData();
    }, []);

    useEffect(() => {
        if (!isDataLoading && cartIsEmpty) {
            const timer = setTimeout(() => {
                router.push('/cart');
            }, 2000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [isDataLoading, cartIsEmpty, router]);


    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            toast({ variant: 'destructive', title: 'No Address Selected', description: 'Please select or add a shipping address.' });
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ addressId: selectedAddress }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to place order.');
                }
                
                const data = await res.json();
                toast({
                    title: 'Order Placed Successfully!',
                    description: 'Thank you for your purchase. You can view your order in your profile.',
                });
                router.push('/profile/orders');
                router.refresh();

            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error Placing Order', description: error.message });
            }
        });
    };

    const subtotal = cart?.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) || 0;

    if (isDataLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    if (cartIsEmpty) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Your cart is empty.</h1>
                <p className="mt-2 text-muted-foreground">Redirecting you back to the cart...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">Checkout</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <AddressSelector 
                        addresses={user?.addresses || []}
                        selectedAddress={selectedAddress}
                        onSelect={setSelectedAddress}
                        onAddressAdded={fetchCheckoutData}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border p-4 bg-muted/50">
                                <h3 className="font-semibold">Cash on Delivery</h3>
                                <p className="text-sm text-muted-foreground mt-2">Pay with cash upon arrival.</p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                                    <Truck className="h-5 w-5" />
                                    <span>Estimated delivery in 10-13 days.</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6 sticky top-24">
                   <OrderSummary cart={cart} total={subtotal} />
                    <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder || !selectedAddress}
                    >
                        {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
