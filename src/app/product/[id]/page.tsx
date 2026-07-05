import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RatingStars from "@/components/ui/RatingStars";
import PriceTag from "@/components/ui/PriceTag";
import Badge from "@/components/ui/Badge";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { findCategoryBySlug } from "@/data/categories";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) notFound();

  const category = findCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:pb-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          { label: product.title },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <p className="text-sm text-text-muted">{product.brand}</p>
            <h1 className="mb-2 text-2xl font-semibold text-text">{product.title}</h1>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={16} />
            {product.badge && <Badge className="mt-2">{product.badge}</Badge>}
            <div className="my-4 border-t border-border pt-4">
              <PriceTag price={product.price} originalPrice={product.originalPrice} currency={product.currency} size="lg" />
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-text-muted">
              {Object.entries(product.specifications)
                .slice(0, 3)
                .map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-5">
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-10">
        <ProductTabs product={product} />
      </div>

      <RelatedProducts products={related} />
    </main>
  );
}
