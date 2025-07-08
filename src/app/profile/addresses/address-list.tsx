'use client';

import { useTransition } from 'react';
import type { IAddress } from '@/models/User';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteAddress } from '../actions';
import { Loader2, MapPin, Trash2 } from 'lucide-react';

function DeleteAddressButton({ addressId }: { addressId: string }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteAddress(addressId);
            if (result.success) {
                toast({ title: 'Success!', description: result.message });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        });
    };
    
    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete address</span>
        </Button>
    )
}

export function AddressList({ addresses }: { addresses: IAddress[] }) {
    if (addresses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <MapPin className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No addresses found</h3>
                <p className="mt-2">You haven't added any shipping addresses yet.</p>
            </div>
        );
    }
    
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map(address => (
                <div key={address._id.toString()} className="rounded-lg border bg-card p-4 flex justify-between items-start">
                    <div className="text-sm">
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-muted-foreground">{address.line1}</p>
                        {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                        <p className="text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                        <p className="text-muted-foreground">{address.country}</p>
                    </div>
                    <div>
                        <DeleteAddressButton addressId={address._id.toString()} />
                    </div>
                </div>
            ))}
        </div>
    );
}
