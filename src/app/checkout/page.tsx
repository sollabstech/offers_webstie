"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useOrdersStore } from "@/store/ordersStore";
import { products } from "@/data/products";
import { formatPrice, generateOrderId } from "@/utils/format";
import CheckoutStepper from "@/components/CheckoutStepper";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Address } from "@/types";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card (demo)" },
  { id: "upi", label: "UPI (demo)" },
  { id: "cod", label: "Cash on Delivery" },
];

const EMPTY_ADDRESS: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  phone: "",
};

/**
 * Mock multi-step checkout: Address -> Payment -> Review -> Place Order.
 * No real payment collection is implemented; "Place Order" simply records a
 * mock order and redirects to the confirmation screen.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);

  const items = lines
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((entry) => entry.product);
  const subtotal = items.reduce((sum, { line, product }) => sum + (product?.price ?? 0) * line.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  const total = subtotal + shipping;

  const addressComplete = useMemo(
    () => address.fullName && address.line1 && address.city && address.state && address.postalCode && address.phone,
    [address]
  );

  const placeOrder = () => {
    const orderId = generateOrderId();
    addOrder({
      id: orderId,
      items: lines,
      address,
      paymentMethod,
      subtotal,
      total,
      placedAt: new Date().toISOString(),
      status: "Placed",
    });
    clearCart();
    router.push(`/checkout/confirmation?order=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-text-muted">Your cart is empty, so there is nothing to check out.</p>
        <Button onClick={() => router.push("/")}>Continue shopping</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Checkout</h1>
      <CheckoutStepper current={step} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-border bg-surface p-5">
          {step === 0 && (
            <form
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="font-medium text-text">Full name</span>
                <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="font-medium text-text">Address line 1</span>
                <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="font-medium text-text">Address line 2 (optional)</span>
                <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-text">City</span>
                <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-text">State</span>
                <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-text">Postal code</span>
                <input required value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-text">Phone</span>
                <input required type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={!addressComplete}>
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-muted">
                This is a demo checkout — no real payment details are collected.
              </p>
              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Payment method</legend>
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    {method.label}
                  </label>
                ))}
              </fieldset>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue to Review</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="mb-1 text-sm font-semibold text-text">Shipping to</h2>
                <p className="text-sm text-text-muted">
                  {address.fullName}, {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                  {address.postalCode}, {address.country} &middot; {address.phone}
                </p>
              </div>
              <div>
                <h2 className="mb-1 text-sm font-semibold text-text">Payment method</h2>
                <p className="text-sm text-text-muted">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</p>
              </div>
              <div>
                <h2 className="mb-1 text-sm font-semibold text-text">Items ({items.length})</h2>
                <ul className="divide-y divide-border rounded-md border border-border">
                  {items.map(({ line, product }) => (
                    <li key={line.productId} className="flex justify-between px-3 py-2 text-sm">
                      <span className="text-text">
                        {product!.title} &times; {line.quantity}
                      </span>
                      <span className="font-medium text-text">{formatPrice(product!.price * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button variant="accent" onClick={placeOrder}>Place Order</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-text">Order Summary</h2>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold text-text">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
