'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = 20,
  onRate,
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onRate) return;
    onRate(index);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              'transition-colors',
              !readOnly && 'cursor-pointer',
              starValue <= (hoverRating || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-400 fill-gray-400/50'
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
}
