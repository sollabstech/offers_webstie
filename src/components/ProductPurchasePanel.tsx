"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import QuantityStepper from "@/components/QuantityStepper";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/utils/format";

interface ProductPurchasePanelProps {
  product: Product;
}

/** Variant selectors, quantity stepper, and Add to Cart / Buy Now actions (sticky on mobile). */
export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const variantGroups = useMemo(() => {
    const groups = new Map<string, typeof product.variants>();
    (product.variants ?? []).forEach((v) => {
      const list = groups.get(v.type) ?? [];
      list.push(v);
      groups.set(v.type, list);
    });
    return groups;
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.id
  );

  const handleAddToCart = () => addItem(product.id, quantity, selectedVariant);
  const handleBuyNow = () => {
    addItem(product.id, quantity, selectedVariant);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4">
      {Array.from(variantGroups.entries()).map(([type, options]) => (
        <div key={type}>
          <p className="mb-1.5 text-sm font-medium text-text capitalize">{type}</p>
          <div className="flex flex-wrap gap-2">
            {options?.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedVariant(opt.id)}
                aria-pressed={selectedVariant === opt.id}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm",
                  selectedVariant === opt.id
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-text hover:border-primary"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Quantity</p>
        <QuantityStepper quantity={quantity} onChange={setQuantity} max={Math.min(10, product.stock)} />
      </div>

      <p className="text-sm text-success">
        {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
      </p>

      <div className="hidden flex-col gap-2 sm:flex">
        <Button onClick={handleAddToCart} variant="secondary" disabled={product.stock === 0}>
          Add to Cart
        </Button>
        <Button onClick={handleBuyNow} variant="accent" disabled={product.stock === 0}>
          Buy Now
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-surface p-3 sm:hidden">
        <Button onClick={handleAddToCart} variant="secondary" className="flex-1" disabled={product.stock === 0}>
          Add to Cart
        </Button>
        <Button onClick={handleBuyNow} variant="accent" className="flex-1" disabled={product.stock === 0}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
