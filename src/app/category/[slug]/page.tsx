import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryPageContent from "@/components/CategoryPageContent";
import ProductListing from "@/components/ProductListing";
import { findCategoryBySlug } from "@/data/categories";
import { getProductsByCategory, dealProducts } from "@/data/products";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/** Convert a slug like "mens-dress" → "Mens Dress" as a fallback display name. */
function slugToName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "deals") return { title: "Flash Offers" };
  const category = findCategoryBySlug(slug);
  const name = category?.name ?? slugToName(slug);
  return {
    title: name,
    description: `Shop ${name} at Offerss.com. Compare prices, ratings and reviews.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (slug === "deals") {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Flash Offers" }]} />
        </div>
        <ProductListing heading="Flash Offers" products={dealProducts} />
      </>
    );
  }

  // Try static data first; fall back gracefully so Firestore-only categories still work
  const category = findCategoryBySlug(slug);
  const name = category?.name ?? slugToName(slug);
  const products = category ? getProductsByCategory(slug) : [];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: name }]} />
      </div>
      <CategoryPageContent heading={name} staticProducts={products} categorySlug={slug} />
    </>
  );
}
