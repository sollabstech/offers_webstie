import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import CategoryCardModule, { buildTilesFromCategory } from "@/components/CategoryCardModule";
import PillLinks from "@/components/PillLinks";
import ProductGrid from "@/components/ProductGrid";
import { categories } from "@/data/categories";
import { trendingProducts, dealProducts } from "@/data/products";
import { categoryImageUrl } from "@/data/imageKeywords";

const HERO_SLIDES = [
  { id: "hero-1", label: "Big Deals on Electronics", categorySlug: "electronics" },
  { id: "hero-2", label: "Refresh Your Home", categorySlug: "home" },
  { id: "hero-3", label: "New Season Fashion", categorySlug: "fashion" },
];

export default function HomePage() {
  const moduleCategories = categories.slice(0, 4);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <Carousel
          className="h-48 sm:h-64 md:h-80"
          slides={HERO_SLIDES.map((slide) => ({
            id: slide.id,
            content: (
              <div className="relative h-48 w-full sm:h-64 md:h-80">
                <Image
                  src={categoryImageUrl(slide.categorySlug, 1600, 500)}
                  alt={slide.label}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                  <h2 className="max-w-md text-2xl font-bold text-white drop-shadow sm:text-3xl md:text-4xl">
                    {slide.label}
                  </h2>
                </div>
              </div>
            ),
          }))}
        />
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
