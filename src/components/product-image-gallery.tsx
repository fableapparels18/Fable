
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CldImage } from 'next-cloudinary';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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

  const ImageComponent = hasCloudName ? CldImage : Image;
  const imageProps = hasCloudName ? { crop: 'fill', gravity: 'auto' } : {};
  const thumbProps = hasCloudName ? { crop: 'thumb', gravity: 'auto' } : {};

  if (!hasCloudName || images.length === 0) {
    const placeholderImages = ['https://placehold.co/600x600.png', 'https://placehold.co/100x100.png'];
    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-lg">
                <div className="relative aspect-square min-w-0 flex-[0_0_100%]">
                    <Image
                        src={placeholderImages[0]}
                        alt={productName}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
             <div className="overflow-hidden flex justify-center">
                <div className="-ml-4 flex">
                    <div className="relative aspect-square w-20 flex-[0_0_5rem] cursor-pointer pl-4">
                        <div className="block h-full w-full overflow-hidden rounded-md">
                            <Image src={placeholderImages[1]} alt="thumbnail" fill className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg" ref={mainCarouselRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="relative aspect-square min-w-0 flex-[0_0_100%]" key={index}>
              <ImageComponent
                src={src}
                alt={`${productName} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                {...imageProps}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden flex justify-center" ref={thumbCarouselRef}>
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
                <ImageComponent
                  src={src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  {...thumbProps}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
