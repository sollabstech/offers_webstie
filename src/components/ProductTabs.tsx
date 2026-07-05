"use client";

import { useState } from "react";
import type { Product } from "@/types";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/utils/format";

interface ProductTabsProps {
  product: Product;
}

const TABS = ["Description", "Specifications", "Reviews"] as const;

/** Tabbed sections for product description, specs table, and reviews with a rating breakdown chart. */
export default function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => r.rating === star).length;
    const percent = product.reviews.length ? Math.round((count / product.reviews.length) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium",
              active === tab ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"
            )}
          >
            {tab}
            {tab === "Reviews" && ` (${product.reviewCount})`}
          </button>
        ))}
      </div>

      <div className="py-5">
        {active === "Description" && (
          <p className="max-w-3xl text-sm leading-relaxed text-text">{product.description}</p>
        )}

        {active === "Specifications" && (
          <dl className="grid max-w-2xl grid-cols-1 gap-y-2 sm:grid-cols-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-border py-2 text-sm sm:justify-start sm:gap-4">
                <dt className="text-text-muted">{key}</dt>
                <dd className="font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "Reviews" && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full max-w-xs shrink-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-3xl font-semibold text-text">{product.rating.toFixed(1)}</span>
                <RatingStars rating={product.rating} size={18} />
              </div>
              <p className="mb-3 text-sm text-text-muted">{product.reviewCount} global ratings</p>
              <ul className="flex flex-col gap-1.5">
                {breakdown.map(({ star, percent }) => (
                  <li key={star} className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="w-10">{star} star</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-alt">
                      <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right">{percent}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex-1 divide-y divide-border">
              {product.reviews.map((review) => (
                <li key={review.id} className="py-4">
                  <div className="mb-1 flex items-center gap-2">
                    <RatingStars rating={review.rating} size={13} />
                    <p className="text-sm font-semibold text-text">{review.title}</p>
                  </div>
                  <p className="mb-1 text-xs text-text-muted">
                    {review.author} &middot; {review.date} {review.verified && "· Verified Purchase"}
                  </p>
                  <p className="text-sm text-text">{review.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
