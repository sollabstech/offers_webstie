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
import { getFirestoreProductBySlug, getVendorById } from "@/lib/firestoreServer";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id) ?? await getFirestoreProductBySlug(id);
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
  const product = getProductBySlug(id) ?? await getFirestoreProductBySlug(id);
  if (!product) notFound();

  const category = findCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product);
  const vendor = product.vendorId && product.vendorId !== "__offerss__"
    ? await getVendorById(product.vendorId)
    : null;

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
            {/* Seller badge */}
            {product.vendorId === "__offerss__" ? (
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1">
                <span className="text-xs font-bold text-primary">⭐ Offerss.com Official Store</span>
              </div>
            ) : product.brand ? (
              <p className="text-sm text-text-muted">
                Sold by <span className="font-medium text-text">{product.brand}</span>
              </p>
            ) : null}
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
            {/* Seller info box */}
            <div className="mt-4 rounded-lg border border-border bg-surface p-3 text-sm">
              {product.vendorId === "__offerss__" ? (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-base">O</div>
                  <div>
                    <p className="font-semibold text-text">Offerss.com</p>
                    <p className="text-text-muted text-xs">Official Store · Ships &amp; sold directly by Offerss.com</p>
                    <p className="mt-0.5 text-xs text-green-600 font-medium">✓ Authentic · ✓ Warranty covered · ✓ Easy returns</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-base uppercase">
                    {(vendor?.name ?? product.brand ?? "V").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text">{vendor?.name ?? product.brand ?? "Independent Vendor"}</p>
                    {vendor?.company && <p className="text-text-muted text-xs">{vendor.company}</p>}
                    <div className="mt-1.5 space-y-0.5">
                      {vendor?.email && (
                        <p className="flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="text-primary">✉</span> {vendor.email}
                        </p>
                      )}
                      {vendor?.phone && (
                        <p className="flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="text-primary">📞</span> {vendor.phone}
                        </p>
                      )}
                      {vendor?.address && (
                        <p className="flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="text-primary">📍</span> {vendor.address}
                        </p>
                      )}
                      {vendor?.category && (
                        <p className="flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="text-primary">🏪</span> {vendor.category}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-green-600 font-medium">✓ Verified Offerss.com vendor</p>
                  </div>
                </div>
              )}
            </div>
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
