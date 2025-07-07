'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminBannerPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
                <p className="text-muted-foreground">Update the homepage banner.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Banner</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">No banner management functionality has been implemented yet.</p>
                </CardContent>
            </Card>
        </div>
    );
}
