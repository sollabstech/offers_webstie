"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useOrdersStore } from "@/store/ordersStore";
import { useAddressStore } from "@/store/addressStore";
import { getFirebaseAuth } from "@/lib/firebase";
import { writeOrder } from "@/lib/db";
import { products as staticProducts } from "@/data/products";
import { getFirestoreProducts } from "@/lib/firestoreProducts";
import { formatPrice, generateOrderId } from "@/utils/format";
import type { Product } from "@/types";
import CheckoutStepper from "@/components/CheckoutStepper";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Address } from "@/types";

const PAYMENT_METHODS = [
  {
    id: "phonepe",
    label: "PhonePe",
    tag: "UPI",
    color: "#5f259f",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect width="40" height="40" rx="8" fill="#5f259f" />
        <path d="M27.5 13.5h-5.2L16 20.5l6.3 7h5.2l-6.3-7 6.3-7z" fill="#fff" />
        <circle cx="14.5" cy="20.5" r="2.5" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "gpay",
    label: "Google Pay",
    tag: "UPI",
    color: "#4285f4",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect width="40" height="40" rx="8" fill="#fff" stroke="#e5e7eb" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold">
          <tspan fill="#4285f4">G</tspan>
          <tspan fill="#ea4335">P</tspan>
          <tspan fill="#fbbc05">a</tspan>
          <tspan fill="#34a853">y</tspan>
        </text>
      </svg>
    ),
  },
  {
    id: "paytm",
    label: "Paytm",
    tag: "Wallet / UPI",
    color: "#00baf2",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect width="40" height="40" rx="8" fill="#00baf2" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff">Paytm</text>
      </svg>
    ),
  },
  { id: "card", label: "Credit / Debit Card", tag: "Card", color: "#64748b", logo: (
    <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
      <rect width="40" height="40" rx="8" fill="#1e293b" />
      <rect x="6" y="13" width="28" height="4" rx="1" fill="#94a3b8" />
      <rect x="6" y="22" width="8" height="3" rx="1" fill="#64748b" />
      <rect x="17" y="22" width="6" height="3" rx="1" fill="#64748b" />
    </svg>
  )},
  { id: "cod", label: "Cash on Delivery", tag: "COD", color: "#16a34a", logo: (
    <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
      <rect width="40" height="40" rx="8" fill="#dcfce7" />
      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fill="#16a34a">₹</text>
    </svg>
  )},
];

const EMPTY_ADDRESS: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
};

/**
 * Mock multi-step checkout: Address -> Payment -> Review -> Place Order.
 * On completion writes the order to Firestore so the admin panel can see it.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const savedAddress = useAddressStore((s) => s.address);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>(savedAddress ?? EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [productsLoading, setProductsLoading] = useState(staticProducts.length === 0);

  useEffect(() => {
    getFirestoreProducts().then((fp) => {
      const staticIds = new Set(staticProducts.map((p) => p.id));
      setAllProducts([...staticProducts, ...fp.filter((p) => !staticIds.has(p.id))]);
      setProductsLoading(false);
    });
  }, []);

  const items = lines
    .map((line) => ({ line, product: allProducts.find((p) => p.id === line.productId) }))
    .filter((entry) => entry.product);
  const subtotal = items.reduce((sum, { line, product }) => sum + (product?.price ?? 0) * line.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  const total = subtotal + shipping;

  const addressComplete = useMemo(
    () => address.fullName && address.line1 && address.city && address.state && address.postalCode && address.phone,
    [address]
  );

  const placeOrder = async () => {
    const orderId = generateOrderId();
    const now = new Date().toISOString();
    const auth = getFirebaseAuth();
    const firebaseUser = auth?.currentUser;

    // Save to local store (existing behavior)
    addOrder({
      id: orderId,
      items: lines,
      address,
      paymentMethod,
      subtotal,
      total,
      placedAt: now,
      status: "Placed",
    });

    // Also write to Firestore so admin can see this order
    void writeOrder({
      id: orderId,
      userId: firebaseUser?.uid ?? "guest",
      userName: address.fullName,
      userEmail: firebaseUser?.email ?? "",
      userPhone: firebaseUser?.phoneNumber ?? address.phone,
      items: items.map(({ line, product }) => ({
        productId: line.productId,
        productName: product?.title ?? "",
        productImage: product?.images?.[0] ?? "",
        quantity: line.quantity,
        price: product?.price ?? 0,
      })),
      subtotal,
      total,
      shippingAddress: `${address.fullName}, ${address.line1}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`,
      address,
      paymentMethod,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    clearCart();
    router.push(`/checkout/confirmation?order=${orderId}`);
  };

  if (productsLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-text-muted">Loading checkout...</p>
      </main>
    );
  }

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
                Select a payment method. This is a demo checkout — no real payment is processed.
              </p>
              <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <legend className="sr-only">Payment method</legend>
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      {method.logo}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text">{method.label}</span>
                        <span className="text-xs text-text-muted">{method.tag}</span>
                      </div>
                      {selected && (
                        <svg className="ml-auto h-4 w-4 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  );
                })}
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
