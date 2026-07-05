"use client";

import Link from "next/link";
import Image from "next/image";
import { useOrdersStore } from "@/store/ordersStore";
import { products } from "@/data/products";
import { formatPrice } from "@/utils/format";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your Orders" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="mb-4 text-text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="text-primary underline">Start shopping</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs text-text-muted">
                <span>
                  Order placed <strong className="text-text">{new Date(order.placedAt).toLocaleDateString()}</strong>
                </span>
                <span>
                  Total <strong className="text-text">{formatPrice(order.total)}</strong>
                </span>
                <span>
                  Order # <strong className="text-text">{order.id}</strong>
                </span>
                <span className="rounded-full bg-primary-light px-2 py-0.5 font-medium text-primary">{order.status}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {order.items.map((line) => {
                  const product = products.find((p) => p.id === line.productId);
                  if (!product) return null;
                  return (
                    <Link key={line.productId} href={`/product/${product.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                      <Image src={product.images[0]} alt={product.title} fill sizes="64px" className="object-cover" />
                    </Link>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
