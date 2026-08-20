"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";
import ProductListing from "@/components/ProductListing";
import { getFirestoreProducts } from "@/lib/firestoreProducts";
import { categories } from "@/data/categories";

interface Props {
  heading: string;
  staticProducts: Product[];
  categorySlug: string;
}

// Find the parent slug for a subcategory (e.g. "electronics-laptops" → "electronics")
function getParentSlug(slug: string): string | null {
  for (const cat of categories) {
    if (cat.children?.some((c) => c.slug === slug)) return cat.slug;
  }
  return null;
}

export default function CategoryPageContent({ heading, staticProducts, categorySlug }: Props) {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parentSlug = getParentSlug(categorySlug);

    getFirestoreProducts().then((all) => {
      const staticIds = new Set(staticProducts.map((p) => p.id));
      const extras = all.filter((p) => {
        if (staticIds.has(p.id)) return false;
        // Match exact subcategory slug OR parent slug (products stored under parent still show in child pages)
        return p.categorySlug === categorySlug || p.categorySlug === parentSlug;
      });
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
