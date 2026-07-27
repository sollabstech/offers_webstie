"use client";

import { useEffect, useState } from "react";
import { getFirestoreProducts } from "@/lib/firestoreProducts";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

interface Props {
  /** IDs already shown by the static layer — avoids duplicates */
  excludeIds?: Set<string>;
  query?: string;
  categorySlug?: string;
  heading?: string;
}

export default function FirestoreProducts({ excludeIds, query, categorySlug, heading }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFirestoreProducts().then((all) => {
      let filtered = all.filter((p) => !excludeIds?.has(p.id));
      if (categorySlug) filtered = filtered.filter((p) => p.categorySlug === categorySlug);
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      setProducts(filtered);
    });
  }, [excludeIds, query, categorySlug]);

  if (products.length === 0) return null;

  return (
    <div className="mt-6">
      {heading && <h2 className="text-lg font-semibold text-text mb-3">{heading}</h2>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
