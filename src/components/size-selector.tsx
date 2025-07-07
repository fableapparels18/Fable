'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SizeSelectorProps = {
  sizes: string[];
};

export function SizeSelector({ sizes }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
          onClick={() => setSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
}