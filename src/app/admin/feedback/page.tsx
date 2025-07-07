'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminFeedbackPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
                <p className="text-muted-foreground">Review and manage customer feedback.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>All Feedback</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">No feedback functionality has been implemented yet.</p>
                </CardContent>
            </Card>
        </div>
    );
}
