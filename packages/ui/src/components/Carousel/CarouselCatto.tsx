'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils';

export interface CarouselCattoProps {
  /** Array of image URLs */
  images: string[];
  /** Auto-advance interval in milliseconds */
  interval?: number;
  /** Width of the carousel */
  width?: string;
  /** Height of the carousel */
  height?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Image carousel with auto-advance and manual navigation
 */
const CarouselCatto: React.FC<CarouselCattoProps> = ({
  images,
  interval = 3000,
  width = 'w-[500px]',
  height = 'h-[300px]',
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
      carouselRef.current.style.transform = `translateX(-${
        currentIndex * 100
      }%)`;
    }
  }, [currentIndex]);

  const restartInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
    restartInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    restartInterval();
  };

  return (
    <div className={cn('relative overflow-hidden', width, height, className)}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        ref={carouselRef}
        style={{ '--image-count': images.length } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'h-full w-full shrink-0 bg-cover bg-center',
              index === currentIndex ? 'active' : '',
            )}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer border-none bg-black/50 px-4 py-2 text-slate-50 hover:bg-black/70 transition-colors"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer border-none bg-black/50 px-4 py-2 text-slate-50 hover:bg-black/70 transition-colors"
        onClick={goToNext}
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );
};

export default CarouselCatto;
