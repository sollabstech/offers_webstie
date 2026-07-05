import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ products, heading = "Related products" }: { products: Product[]; heading?: string }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-10">
      <h2 id="related-heading" className="mb-4 text-lg font-semibold text-text">
        {heading}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="w-44 shrink-0 sm:w-52">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
