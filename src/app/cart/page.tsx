"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { products } from "@/data/products";
import { formatPrice } from "@/utils/format";
import QuantityStepper from "@/components/QuantityStepper";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const items = lines
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((entry) => entry.product);

  const subtotal = items.reduce((sum, { line, product }) => sum + (product?.price ?? 0) * line.quantity, 0);
  const totalItems = items.reduce((sum, { line }) => sum + line.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-40 sm:pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="mb-4 text-text-muted">Your cart is empty.</p>
          <Link href="/" className="text-primary underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {items.map(({ line, product }) => (
              <li key={`${line.productId}-${line.variantId ?? "base"}`} className="flex gap-4 p-4">
                <Link href={`/product/${product!.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                  <Image src={product!.images[0]} alt={product!.title} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/product/${product!.slug}`} className="line-clamp-2 text-sm font-medium text-text hover:text-primary">
                      {product!.title}
                    </Link>
                    <p className="text-sm font-semibold text-text">{formatPrice(product!.price, product!.currency)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      quantity={line.quantity}
                      onChange={(next) => setQuantity(line.productId, next, line.variantId)}
                      max={product!.stock}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.productId, line.variantId)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-danger"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="hidden h-fit rounded-lg border border-border bg-surface p-5 lg:block lg:sticky lg:top-24">
            <p className="mb-2 text-sm text-text-muted">
              Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </p>
            <p className="mb-4 text-xl font-semibold text-text">{formatPrice(subtotal)}</p>
            <Link href="/checkout">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </aside>

          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-surface p-4 lg:hidden">
            <div>
              <p className="text-xs text-text-muted">Subtotal</p>
              <p className="text-lg font-semibold text-text">{formatPrice(subtotal)}</p>
            </div>
            <Link href="/checkout" className="flex-1">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
