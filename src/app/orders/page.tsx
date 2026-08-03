"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, X } from "lucide-react";
import { useOrdersStore } from "@/store/ordersStore";
import { useAuthState } from "@/hooks/useAuthState";
import { fetchOrdersByUser, writeReturn, fetchReturnsByUser, type FirestoreOrder, type FirestoreReturn } from "@/lib/db";
import { products as staticProducts } from "@/data/products";
import { getFirestoreProducts } from "@/lib/firestoreProducts";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import Breadcrumbs from "@/components/Breadcrumbs";

const RETURN_REASONS = [
  "Defective / Not working",
  "Wrong item delivered",
  "Item not as described",
  "Damaged packaging",
  "Changed my mind",
  "Better price available",
  "Missing parts / accessories",
  "Other",
];

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  shipped:    "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  pending:    "bg-orange-100 text-orange-700",
  cancelled:  "bg-red-100 text-red-700",
  placed:     "bg-purple-100 text-purple-700",
};

const RETURN_STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

interface ReturnModalProps {
  order: FirestoreOrder;
  onClose: () => void;
  onSubmit: (data: { reason: string; details: string; type: "return" | "replace"; productId: string; productName: string; productImage: string }) => Promise<void>;
}

function ReturnModal({ order, onClose, onSubmit }: ReturnModalProps) {
  const [type, setType] = useState<"return" | "replace">("return");
  const [selectedProduct, setSelectedProduct] = useState(order.items[0]?.productId ?? "");
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const item = order.items.find((i) => i.productId === selectedProduct) ?? order.items[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ reason, details, type, productId: item.productId, productName: item.productName, productImage: item.productImage });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <h2 className="font-semibold text-text">Return / Replace Item</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text"><X size={20} /></button>
        </div>

        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <p className="font-semibold text-text">Request Submitted!</p>
            <p className="text-sm text-text-muted">Your {type} request has been sent. We&apos;ll review it and respond within 2 business days.</p>
            <button onClick={onClose} className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-primary/90">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Type toggle */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              {(["return", "replace"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${type === t ? "bg-primary text-white" : "bg-surface text-text-muted hover:bg-surface-alt"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Product selector (if multiple items) */}
            {order.items.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Select item</label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  {order.items.map((i) => (
                    <option key={i.productId} value={i.productId}>{i.productName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected product preview */}
            <div className="flex items-center gap-3 rounded-lg bg-surface-alt p-3">
              {item?.productImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded-md object-cover shrink-0" />
              )}
              <p className="text-sm font-medium text-text line-clamp-2">{item?.productName}</p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Reason *</label>
              <select required value={reason} onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Additional details</label>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} placeholder="Describe the issue..."
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-text hover:bg-surface-alt">Cancel</button>
              <button type="submit" disabled={submitting}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const localOrders = useOrdersStore((s) => s.orders);
  const { user } = useAuthState();
  const [firestoreOrders, setFirestoreOrders] = useState<FirestoreOrder[]>([]);
  const [myReturns, setMyReturns] = useState<FirestoreReturn[]>([]);
  const [returnModal, setReturnModal] = useState<FirestoreOrder | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    getFirestoreProducts().then((fp) => {
      const staticIds = new Set(staticProducts.map((p) => p.id));
      setAllProducts([...staticProducts, ...fp.filter((p) => !staticIds.has(p.id))]);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchOrdersByUser(user.uid, user.email ?? undefined).then(setFirestoreOrders);
    fetchReturnsByUser(user.uid, user.email ?? undefined).then(setMyReturns);
  }, [user]);

  const localIds = new Set(firestoreOrders.map((o) => o.id));
  const mergedOrders: FirestoreOrder[] = [
    ...firestoreOrders,
    ...localOrders
      .filter((o) => !localIds.has(o.id))
      .map((o) => ({
        id: o.id,
        userId: user?.uid ?? "",
        userName: "",
        userEmail: user?.email ?? "",
        userPhone: "",
        items: o.items.map((i) => {
          const p = allProducts.find((p) => p.id === i.productId);
          return { productId: i.productId, productName: p?.title ?? "", productImage: p?.images[0] ?? "", quantity: i.quantity, price: p?.price ?? 0 };
        }),
        subtotal: o.total, total: o.total, shippingAddress: "", address: {},
        paymentMethod: o.paymentMethod, status: o.status,
        createdAt: o.placedAt, updatedAt: o.placedAt,
      })),
  ];

  const handleReturnSubmit = async (data: { reason: string; details: string; type: "return" | "replace"; productId: string; productName: string; productImage: string }) => {
    if (!returnModal) return;
    const id = `RET-${Date.now()}`;
    const now = new Date().toISOString();
    const ret: FirestoreReturn = {
      id, orderId: returnModal.id,
      userId: user?.uid ?? "guest",
      userEmail: user?.email ?? returnModal.userEmail,
      userName: user?.displayName ?? returnModal.userName,
      ...data,
      status: "pending",
      createdAt: now, updatedAt: now,
    };
    await writeReturn(ret);
    setMyReturns((prev) => [ret, ...prev]);
  };

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
            const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            const orderReturn = myReturns.find((r) => r.orderId === order.id);

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
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${statusClass}`}>{order.status}</span>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-text-muted">Order #</p>
                      <p className="text-xs font-mono text-text">{order.id}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {order.items.map((line) => {
                    const imgSrc = line.productImage || allProducts.find((p) => p.id === line.productId)?.images[0];
                    return (
                      <div key={line.productId} className="flex items-center gap-4 px-5 py-4">
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-alt overflow-hidden border border-border">
                          {imgSrc
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={imgSrc} alt={line.productName} className="h-full w-full object-cover" />
                            : <div className="h-full w-full flex items-center justify-center"><Package size={20} className="text-text-muted opacity-40" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text line-clamp-2 text-sm">{line.productName || "Product"}</p>
                          <p className="text-xs text-text-muted mt-0.5">Qty: {line.quantity}</p>
                        </div>
                        <p className="shrink-0 font-semibold text-text">{formatPrice(line.price * line.quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Return status bar */}
                {orderReturn && (
                  <div className={`flex items-center gap-2 border-t border-border px-5 py-2.5 text-xs font-medium ${RETURN_STATUS_STYLES[orderReturn.status]}`}>
                    <span className="capitalize">Return {orderReturn.type}: </span>
                    <span className="font-semibold capitalize">{orderReturn.status}</span>
                    {orderReturn.status === "pending" && <span className="text-text-muted ml-1">— under review</span>}
                    {orderReturn.status === "approved" && <span className="ml-1">— we will contact you shortly</span>}
                    {orderReturn.status === "rejected" && <span className="ml-1">— does not meet return criteria</span>}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-surface-alt px-5 py-3">
                  <p className="text-xs text-text-muted md:hidden font-mono">#{order.id}</p>
                  <div className="flex gap-3 ml-auto">
                    {!orderReturn && (
                      <button onClick={() => setReturnModal(order)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-alt transition-colors">
                        Return / Replace
                      </button>
                    )}
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

      {returnModal && (
        <ReturnModal
          order={returnModal}
          onClose={() => setReturnModal(null)}
          onSubmit={handleReturnSubmit}
        />
      )}
    </main>
  );
}
