"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import ProductListing from "@/components/ProductListing";
import { getFirestoreProducts } from "@/lib/firestoreProducts";

interface Props {
  heading: string;
  staticProducts: Product[];
  query?: string;
  categorySlug?: string;
}

export default function SearchResults({ heading, staticProducts, query, categorySlug }: Props) {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const staticIds = new Set(staticProducts.map((p) => p.id));
    const q = query?.toLowerCase();
    getFirestoreProducts().then((all) => {
      setFirestoreProducts(
        all.filter(
          (p) =>
            !staticIds.has(p.id) &&
            (!categorySlug || p.categorySlug === categorySlug) &&
            (!q ||
              p.title.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)))
        )
      );
      setLoading(false);
    });
  }, [staticProducts, query, categorySlug]);

  return (
    <ProductListing
      heading={heading}
      products={[...staticProducts, ...firestoreProducts]}
      firestoreSupplementing={loading && staticProducts.length === 0}
    />
  );
}
