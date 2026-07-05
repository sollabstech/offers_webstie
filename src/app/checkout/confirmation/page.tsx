"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOrdersStore } from "@/store/ordersStore";
import { formatPrice } from "@/utils/format";
import Button from "@/components/ui/Button";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const orders = useOrdersStore((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-4 text-text-muted">We could not find that order.</p>
        <Link href="/" className="text-primary underline">Return home</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto mb-4 text-success" size={48} />
      <h1 className="mb-2 text-2xl font-semibold text-text">Order placed!</h1>
      <p className="mb-6 text-text-muted">
        Thanks, {order.address.fullName.split(" ")[0] || "there"}. This is a demo order — no real
        payment was processed.
      </p>
      <div className="mb-6 rounded-lg border border-border bg-surface p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Order number</span>
          <span className="font-medium text-text">{order.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Total</span>
          <span className="font-medium text-text">{formatPrice(order.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Shipping to</span>
          <span className="text-right font-medium text-text">
            {order.address.city}, {order.address.state}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Link href="/orders">
          <Button variant="secondary">View orders</Button>
        </Link>
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
