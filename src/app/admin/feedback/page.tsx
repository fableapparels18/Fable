import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllFeedback } from '@/lib/data';
import type { IFeedback } from '@/models/Feedback';
import { format } from 'date-fns';
import { StarRating } from '@/components/star-rating';
import { DeleteFeedbackButton } from './delete-feedback-button';

function FeedbackTable({ feedback }: { feedback: (IFeedback & { productId: { name: string } })[] }) {
    if (feedback.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No feedback has been submitted yet.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-[40%]">Comment</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {feedback.map((item) => (
                    <TableRow key={item._id.toString()}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {format(new Date(item.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">{item.productId.name}</TableCell>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell>
                            <StarRating rating={item.rating} readOnly size={16} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.comment}</TableCell>
                        <TableCell className="text-right">
                           <DeleteFeedbackButton feedbackId={item._id.toString()} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}


export default async function AdminFeedbackPage() {
    const allFeedback = await getAllFeedback();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
                <p className="text-muted-foreground">Review and manage customer feedback.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>All Feedback</CardTitle>
                    <CardDescription>A list of all feedback submitted by customers.</CardDescription>
                </CardHeader>
                <CardContent>
                   <FeedbackTable feedback={allFeedback} />
                </CardContent>
            </Card>
        </div>
    );
}
