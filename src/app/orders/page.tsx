"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { useOrdersStore } from "@/store/ordersStore";
import { useAuthState } from "@/hooks/useAuthState";
import { fetchOrdersByUser, type FirestoreOrder } from "@/lib/db";
import { products } from "@/data/products";
import { formatPrice } from "@/utils/format";
import Breadcrumbs from "@/components/Breadcrumbs";

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  shipped:   "bg-blue-100 text-blue-700",
  processing:"bg-yellow-100 text-yellow-700",
  pending:   "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  placed:    "bg-purple-100 text-purple-700",
};

export default function OrdersPage() {
  const localOrders = useOrdersStore((s) => s.orders);
  const { user } = useAuthState();
  const [firestoreOrders, setFirestoreOrders] = useState<FirestoreOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchOrdersByUser(user.uid, user.email ?? undefined).then(setFirestoreOrders);
  }, [user]);

  const localIds = new Set(firestoreOrders.map((o) => o.id));
  const mergedOrders: FirestoreOrder[] = [
    ...firestoreOrders,
    ...localOrders
      .filter((o) => !localIds.has(o.id))
      .map((o) => ({
        id: o.id,
        userId: "",
        userName: "",
        userEmail: "",
        userPhone: "",
        items: o.items.map((i) => {
          const p = products.find((p) => p.id === i.productId);
          return {
            productId: i.productId,
            productName: p?.title ?? "",
            productImage: p?.images[0] ?? "",
            quantity: i.quantity,
            price: p?.price ?? 0,
          };
        }),
        subtotal: o.total,
        total: o.total,
        shippingAddress: "",
        address: {},
        paymentMethod: o.paymentMethod,
        status: o.status,
        createdAt: o.placedAt,
        updatedAt: o.placedAt,
      })),
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your Orders" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Orders</h1>

      {mergedOrders.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-16 text-center flex flex-col items-center gap-3">
          <Package size={40} className="text-text-muted opacity-40" />
          <p className="text-text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="mt-1 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">Start shopping</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {mergedOrders.map((order) => {
            const statusKey = order.status.toLowerCase();
            const statusClass = STATUS_STYLES[statusKey] ?? "bg-surface-alt text-text-muted";
            const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <li key={order.id} className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
                {/* Order header */}
                <div className="flex flex-wrap items-center gap-4 border-b border-border bg-surface-alt px-5 py-3">
                  <div>
                    <p className="text-xs text-text-muted">Order placed</p>
                    <p className="text-sm font-semibold text-text">{placedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Total</p>
                    <p className="text-sm font-semibold text-text">{formatPrice(order.total)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-text-muted">Payment</p>
                    <p className="text-sm font-medium text-text capitalize">{order.paymentMethod || "—"}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${statusClass}`}>
                      {order.status}
                    </span>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-text-muted">Order #</p>
                      <p className="text-xs font-mono text-text">{order.id}</p>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y divide-border">
                  {order.items.map((line) => {
                    const product = products.find((p) => p.id === line.productId);
                    const imgSrc = line.productImage || product?.images[0];
                    return (
                      <div key={line.productId} className="flex items-center gap-4 px-5 py-4">
                        {/* Product image */}
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-alt overflow-hidden border border-border">
                          {imgSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imgSrc} alt={line.productName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package size={20} className="text-text-muted opacity-40" />
                            </div>
                          )}
                        </div>
                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text line-clamp-2 text-sm">{line.productName || "Product"}</p>
                          <p className="text-xs text-text-muted mt-0.5">Qty: {line.quantity}</p>
                        </div>
                        {/* Price */}
                        <p className="shrink-0 font-semibold text-text">{formatPrice(line.price * line.quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-surface-alt px-5 py-3">
                  <p className="text-xs text-text-muted md:hidden font-mono">#{order.id}</p>
                  <div className="flex gap-3 ml-auto">
                    <Link href="/help/returns"
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-alt transition-colors">
                      Return / Replace
                    </Link>
                    <Link href="/"
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors">
                      Buy Again
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
