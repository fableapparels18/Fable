'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserWithAddresses, updateUserDetails } from '../actions';
import { ProfileFormSchema, type ProfileFormData } from '@/lib/schemas';
import type { IUser } from '@/models/User';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function EditProfileForm({ user }: { user: IUser }) {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        const result = await updateUserDetails(data);
        if (result.success) {
            toast({ title: 'Success!', description: result.message });
            router.push('/profile');
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };
    
    const isLoading = form.formState.isSubmitting;

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Edit Your Details</CardTitle>
                <CardDescription>Update your name and email address.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

function EditProfileSkeleton() {
    return (
        <Card className="w-full max-w-lg animate-pulse">
            <CardHeader>
                <Skeleton className="h-8 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                 <div className="flex justify-end">
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const fetchedUser = await getUserWithAddresses();
            if (!fetchedUser) {
                router.push('/login');
            } else {
                setUser(fetchedUser);
            }
            setIsLoading(false);
        }
        fetchUser();
    }, [router]);
    
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 flex flex-col items-center">
            <div className="w-full max-w-lg flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Profile</h1>
            </div>
            {isLoading || !user ? <EditProfileSkeleton /> : <EditProfileForm user={user} />}
        </div>
    );
}
