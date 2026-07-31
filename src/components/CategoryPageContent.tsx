"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";
import ProductListing from "@/components/ProductListing";
import { getFirestoreProducts } from "@/lib/firestoreProducts";

interface Props {
  heading: string;
  staticProducts: Product[];
  categorySlug: string;
}

export default function CategoryPageContent({ heading, staticProducts, categorySlug }: Props) {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFirestoreProducts().then((all) => {
      const staticIds = new Set(staticProducts.map((p) => p.id));
      const extras = all.filter((p) => p.categorySlug === categorySlug && !staticIds.has(p.id));
      setFirestoreProducts(extras);
      setLoading(false);
    });
  }, [staticProducts, categorySlug]);

  const allProducts = [...staticProducts, ...firestoreProducts];

  return (
    <ProductListing
      heading={heading}
      products={allProducts}
      firestoreSupplementing={loading && staticProducts.length === 0}
    />
  );
}
