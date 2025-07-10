import { redirect } from 'next/navigation';
import { getUserWithAddresses } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressList } from './address-list';
import { AddAddressDialog } from './add-address-dialog';

export default async function ManageAddressesPage() {
    const user = await getUserWithAddresses();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-[80vh] items-start justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Manage Addresses</CardTitle>
                        <CardDescription>Add, edit, or remove your shipping addresses.</CardDescription>
                    </div>
                    <AddAddressDialog />
                </CardHeader>
                <CardContent>
                    <AddressList addresses={user.addresses || []} />
                </CardContent>
            </Card>
        </div>
    );
}
