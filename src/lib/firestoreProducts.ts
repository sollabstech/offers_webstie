"use client";

import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Product } from "@/types";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  Electronics: "electronics",
  Clothing: "clothing",
  "Home & Garden": "home-garden",
  Sports: "sports",
  Toys: "toys",
  Beauty: "beauty",
  Books: "books",
  Food: "food",
};

/** Live sponsored products first (by admin-assigned rank, then higher bid); everything else keeps its order. */
export function sponsoredFirst(list: Product[]): Product[] {
  const sponsored = list
    .filter((p) => p.sponsoredRank != null)
    .sort((a, b) => a.sponsoredRank! - b.sponsoredRank! || (b.sponsoredBid ?? 0) - (a.sponsoredBid ?? 0));
  if (sponsored.length === 0) return list;
  return [...sponsored, ...list.filter((p) => p.sponsoredRank == null)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAdminProduct(data: any, id: string): Product {
  const category = data.category ?? "";
  const sponsored =
    typeof data.promotedRank === "number" &&
    typeof data.promotedUntil === "string" &&
    new Date(data.promotedUntil).getTime() > Date.now();
  return {
    ...(sponsored ? { sponsoredRank: data.promotedRank, sponsoredBid: data.promotedBid ?? 0, badge: "Sponsored" as const } : {}),
    id,
    slug: data.slug ?? id,
    title: data.name ?? "",
    brand: data.vendorName ?? "",
    vendorId: data.vendorId ?? undefined,
    categorySlug: CATEGORY_SLUG_MAP[category] ?? category.toLowerCase().replace(/\s+/g, "-"),
    price: data.price ?? 0,
    originalPrice: data.originalPrice ?? undefined,
    currency: "INR",
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,
    images: data.images?.length ? data.images : [`https://placehold.co/400x400/1e293b/f97316?text=${encodeURIComponent((data.name ?? "").slice(0, 10))}`],
    description: data.description ?? "",
    specifications: (data.specifications && typeof data.specifications === "object") ? data.specifications as Record<string, string> : {},
    reviews: [],
    stock: data.stock ?? 0,
    tags: data.tags ?? [],
  };
}

export async function getFirestoreProducts(): Promise<Product[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "products"));
    return sponsoredFirst(
      snap.docs
        .filter((d) => {
          const vendorStatus = d.data().vendorStatus;
          return !vendorStatus || vendorStatus === "active";
        })
        .map((d) => mapAdminProduct(d.data(), d.id))
    );
  } catch {
    return [];
  }
}
