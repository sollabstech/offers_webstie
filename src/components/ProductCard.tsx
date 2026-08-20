"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import type { Product } from "@/types";
import RatingStars from "@/components/ui/RatingStars";
import PriceTag from "@/components/ui/PriceTag";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  product: Product;
}

/** Standard product tile used across homepage, category, search, and related-products grids. */
export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative flex h-full flex-col rounded-2xl bg-surface p-3 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <button
        type="button"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-4 top-4 z-10 rounded-full bg-surface/80 p-1.5 text-text-muted hover:text-accent"
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-accent" : ""} />
      </button>

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-surface-alt">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.badge && (
            <Badge className="absolute left-2 top-2" tone={product.badge === "Deal" ? "accent" : "neutral"}>
              {product.badge}
            </Badge>
          )}
        </div>
        <p className="mb-1 text-xs text-text-muted">{product.brand}</p>
        <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-text leading-5">{product.title}</h3>
      </Link>

      <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

      <div className="mt-2 min-h-[3rem]">
        <PriceTag price={product.price} originalPrice={product.originalPrice} currency={product.currency} />
      </div>

      <Button
        size="sm"
        variant="accent"
        className={`mt-auto w-full rounded-full transition-all duration-200 ${added ? "bg-green-500 border-green-500 hover:bg-green-600 scale-[1.02]" : ""}`}
        onClick={handleAddToCart}
        aria-label={`Add ${product.title} to cart`}
      >
        {added ? (
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={15} /> Added!
          </span>
        ) : "Add to Cart"}
      </Button>
    </div>
  );
}
