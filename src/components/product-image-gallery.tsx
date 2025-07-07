'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainCarouselRef, mainCarouselApi] = useEmblaCarousel({ loop: true });
  const [thumbCarouselRef, thumbCarouselApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainCarouselApi || !thumbCarouselApi) return;
      mainCarouselApi.scrollTo(index);
    },
    [mainCarouselApi, thumbCarouselApi]
  );

  const onSelect = useCallback(() => {
    if (!mainCarouselApi || !thumbCarouselApi) return;
    setSelectedIndex(mainCarouselApi.selectedScrollSnap());
    thumbCarouselApi.scrollTo(mainCarouselApi.selectedScrollSnap());
  }, [mainCarouselApi, thumbCarouselApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainCarouselApi) return;
    onSelect();
    mainCarouselApi.on('select', onSelect);
    mainCarouselApi.on('reInit', onSelect);
  }, [mainCarouselApi, onSelect]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg" ref={mainCarouselRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="relative aspect-square min-w-0 flex-[0_0_100%]" key={index}>
              <Image
                src={src}
                alt={`${productName} image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden" ref={thumbCarouselRef}>
        <div className="-ml-4 flex">
          {images.map((src, index) => (
            <div
              className="relative aspect-square w-20 flex-[0_0_5rem] cursor-pointer pl-4"
              key={index}
            >
              <button
                onClick={() => onThumbClick(index)}
                className={cn(
                  'block h-full w-full overflow-hidden rounded-md ring-offset-2 ring-offset-background transition-shadow',
                  selectedIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}