"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOrdersStore } from "@/store/ordersStore";
import { useAuthState } from "@/hooks/useAuthState";
import { fetchOrdersByUser, type FirestoreOrder } from "@/lib/db";
import { products } from "@/data/products";
import { formatPrice } from "@/utils/format";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function OrdersPage() {
  const localOrders = useOrdersStore((s) => s.orders);
  const { user } = useAuthState();
  const [firestoreOrders, setFirestoreOrders] = useState<FirestoreOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchOrdersByUser(user.uid, user.email ?? undefined).then(setFirestoreOrders);
  }, [user]);

  // Merge: Firestore is source of truth; local orders fill in if not already there
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
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="mb-4 text-text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="text-primary underline">Start shopping</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {mergedOrders.map((order) => (
            <li key={order.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs text-text-muted">
                <span>
                  Order placed <strong className="text-text">{new Date(order.createdAt).toLocaleDateString()}</strong>
                </span>
                <span>
                  Total <strong className="text-text">{formatPrice(order.total)}</strong>
                </span>
                <span>
                  Order # <strong className="text-text">{order.id}</strong>
                </span>
                <span className="rounded-full bg-primary-light px-2 py-0.5 font-medium text-primary capitalize">{order.status}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {order.items.map((line) => {
                  const product = products.find((p) => p.id === line.productId);
                  const imgSrc = line.productImage || product?.images[0];
                  return (
                    <div key={line.productId} className="flex flex-col items-center gap-1 shrink-0">
                      {imgSrc ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-surface-alt">
                          <Image src={imgSrc} alt={line.productName} fill sizes="64px" className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-surface-alt" />
                      )}
                      <p className="text-xs text-text-muted text-center line-clamp-1 w-16">{line.productName}</p>
                    </div>
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
