import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductListing from "@/components/ProductListing";
import { findCategoryBySlug } from "@/data/categories";
import { getProductsByCategory, dealProducts } from "@/data/products";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "deals") return { title: "Today's Deals" };
  const category = findCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `Shop ${category.name} at Offerss.com. Compare prices, ratings and reviews.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (slug === "deals") {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Today's Deals" }]} />
        </div>
        <ProductListing heading="Today's Deals" products={dealProducts} />
      </>
    );
  }

  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />
      </div>
      <ProductListing heading={category.name} products={products} />
    </>
  );
}
