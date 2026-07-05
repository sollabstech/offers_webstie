"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { products } from "@/data/products";
import ProductGrid from "@/components/ProductGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const items = products.filter((p) => productIds.includes(p.id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your Wishlist" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="mb-4 text-text-muted">Your wishlist is empty.</p>
          <Link href="/" className="text-primary underline">Browse products</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </main>
  );
}
