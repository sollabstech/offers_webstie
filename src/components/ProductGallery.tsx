"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/format";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/** Image gallery with a thumbnail strip, left/right nav arrows, and hover-to-magnify on the main image. */
export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            onMouseEnter={() => setActiveIndex(i)}
            aria-label={`Show image ${i + 1} of ${title}`}
            aria-current={i === activeIndex}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
              i === activeIndex ? "border-primary shadow-md" : "border-border hover:border-primary/50"
            )}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image with prev/next arrows */}
      <div
        className="group relative aspect-square w-full flex-1 overflow-hidden rounded-lg bg-surface-alt"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 500px"
          className="object-cover transition-transform duration-200"
          style={
            zoomed
              ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
        />

        {/* Left arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoomed(false); prev(); }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:shadow-lg"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoomed(false); next(); }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:shadow-lg"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomed(false); setActiveIndex(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/70 hover:bg-white"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
