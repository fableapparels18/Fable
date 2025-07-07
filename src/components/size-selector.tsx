'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
};

export function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {

  return (
    <div className="flex items-center gap-2">
      {sizes.map((size) => (
        <Button
          key={size}
          variant="outline"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-md',
            selectedSize === size && 'border-primary ring-2 ring-primary ring-offset-2'
          )}
          onClick={() => onSizeChange(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
}
