import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductListing from "@/components/ProductListing";
import { searchProducts, getProductsByCategory, products as allProducts } from "@/data/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search",
    description: "Search products across Offerss.com.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", category } = await searchParams;

  let results = q ? searchProducts(q) : allProducts;
  if (category) {
    const inCategory = new Set(getProductsByCategory(category).map((p) => p.id));
    results = results.filter((p) => inCategory.has(p.id));
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: q ? `"${q}"` : "All products" }]} />
      </div>
      <ProductListing heading={q ? `Results for "${q}"` : "All products"} products={results} />
    </>
  );
}
