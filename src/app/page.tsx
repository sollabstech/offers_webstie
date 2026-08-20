import Link from "next/link";
import CategoryCardModule, { buildTilesFromCategory } from "@/components/CategoryCardModule";
import PillLinks from "@/components/PillLinks";
import ProductGrid from "@/components/ProductGrid";
import FirestoreProducts from "@/components/FirestoreProducts";
import BannerCarousel from "@/components/BannerCarousel";
import { categories } from "@/data/categories";
import { trendingProducts, dealProducts } from "@/data/products";

const CATEGORY_COLORS = [
  "from-primary to-primary-dark",
  "from-primary to-primary-dark",
  "from-primary to-primary-dark",
  "from-primary to-primary-dark",
];

export default function HomePage() {
  const moduleCategories = categories.slice(0, 4);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <BannerCarousel />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6" aria-label="Shop by category">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleCategories.map((cat, i) => (
            <CategoryCardModule
              key={cat.id}
              title={cat.name}
              tiles={buildTilesFromCategory(cat)}
              seeMoreHref={`/category/${cat.slug}`}
              colorClass={CATEGORY_COLORS[i]}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2" aria-label="Category quick links">
        <PillLinks />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="deals-heading">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="deals-heading" className="border-l-4 border-accent pl-3 text-xl font-bold text-text">
            Flash Offers
          </h2>
          <Link href="/category/deals" className="rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors">
            View all offers →
          </Link>
        </div>
        <ProductGrid products={dealProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="trending-heading">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="trending-heading" className="border-l-4 border-accent pl-3 text-xl font-bold text-text">
            Trending Products
          </h2>
          <Link href="/search?q=" className="rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors">
            See more →
          </Link>
        </div>
        <ProductGrid products={trendingProducts} />
        <FirestoreProducts
          excludeIds={new Set([...trendingProducts, ...dealProducts].map((p) => p.id))}
          heading="New Arrivals"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
      </section>
    </main>
  );
}
