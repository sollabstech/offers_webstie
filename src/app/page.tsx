import Link from "next/link";
import CategoryCardModule, { buildTilesFromCategory } from "@/components/CategoryCardModule";
import PillLinks from "@/components/PillLinks";
import ProductGrid from "@/components/ProductGrid";
import FirestoreProducts from "@/components/FirestoreProducts";
import BannerCarousel from "@/components/BannerCarousel";
import { categories } from "@/data/categories";
import { trendingProducts, dealProducts } from "@/data/products";

export default function HomePage() {
  const moduleCategories = categories.slice(0, 4);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <BannerCarousel />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6" aria-label="Shop by category">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleCategories.map((cat) => (
            <CategoryCardModule
              key={cat.id}
              title={cat.name}
              tiles={buildTilesFromCategory(cat)}
              seeMoreHref={`/category/${cat.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2" aria-label="Category quick links">
        <PillLinks />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="deals-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="deals-heading" className="text-xl font-semibold text-text">
            Today&apos;s Deals
          </h2>
          <Link href="/category/deals" className="text-sm font-medium text-primary hover:underline">
            See all deals
          </Link>
        </div>
        <ProductGrid products={dealProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="trending-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="trending-heading" className="text-xl font-semibold text-text">
            Trending Products
          </h2>
          <Link href="/search?q=" className="text-sm font-medium text-primary hover:underline">
            See more
          </Link>
        </div>
        <ProductGrid products={trendingProducts} />
        <FirestoreProducts
          excludeIds={new Set([...trendingProducts, ...dealProducts].map((p) => p.id))}
          heading="New Arrivals"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex flex-col items-center gap-3 rounded-lg bg-primary px-6 py-8 text-center text-white">
          <h2 className="text-lg font-semibold">Sign in for personalized recommendations</h2>
          <p className="max-w-md text-sm text-white/80">
            Get tailored deals and faster checkout by signing in with your mobile number.
          </p>
          <Link
            href="/account/login"
            className="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
