"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/types";
import ProductListing from "@/components/ProductListing";
import FirestoreProducts from "@/components/FirestoreProducts";

interface Props {
  heading: string;
  staticProducts: Product[];
  query?: string;
  categorySlug?: string;
}

export default function SearchResults({ heading, staticProducts, query, categorySlug }: Props) {
  const [firestoreCount, setFirestoreCount] = useState<number | null>(null);
  const handleCount = useCallback((n: number) => setFirestoreCount(n), []);

  const staticIds = new Set(staticProducts.map((p) => p.id));
  const noStaticResults = staticProducts.length === 0;
  // firestoreCount is null while still loading — only show "no results" once it resolves to 0
  const showNoResults = noStaticResults && firestoreCount === 0;

  return (
    <>
      <ProductListing
        heading={heading}
        products={staticProducts}
        firestoreSupplementing={noStaticResults}
        firestoreCount={firestoreCount ?? 0}
      />
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <FirestoreProducts
          excludeIds={staticIds}
          query={query}
          categorySlug={categorySlug}
          heading={noStaticResults ? undefined : "More products"}
          onCount={handleCount}
        />
        {showNoResults && (
          <p className="py-10 text-center text-text-muted">No products found.</p>
        )}
      </div>
    </>
  );
}
