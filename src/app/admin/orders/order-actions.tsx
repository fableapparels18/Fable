'use client';

import { useTransition } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus } from './actions';

type OrderActionsProps = {
  orderId: string;
};

export function OrderActions({ orderId }: OrderActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (status: 'Out for Delivery' | 'Delivered' | 'Cancelled') => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result?.message) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: result.message,
        });
      } else {
        toast({
          title: 'Success!',
          description: `Order status updated to "${status}".`,
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleStatusUpdate('Out for Delivery')}>
          Mark as Out for Delivery
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleStatusUpdate('Delivered')}>
          Mark as Delivered
        </DropdownMenuItem>
         <DropdownMenuItem onSelect={() => handleStatusUpdate('Cancelled')} className="text-destructive focus:text-destructive">
          Mark as Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
