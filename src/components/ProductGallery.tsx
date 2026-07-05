"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/format";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/** Image gallery with a thumbnail strip and hover-to-magnify on the main image. */
export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
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
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2",
              i === activeIndex ? "border-primary" : "border-border"
            )}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      <div
        className="relative aspect-square w-full flex-1 overflow-hidden rounded-lg bg-surface-alt"
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
      </div>
    </div>
  );
}
