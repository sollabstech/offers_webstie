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
    id: "razorpay",
    label: "Razorpay",
    tag: "Card / UPI / Wallet",
    color: "#2563eb",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect width="40" height="40" rx="8" fill="#2563eb" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#fff">Razor</text>
        <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#fff">pay</text>
      </svg>
    ),
  },
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

interface ShippingQuoteGroup {
  vendorId: string;
  vendorName: string;
  serviceable: boolean;
  reason?: string;
  courierName?: string;
  etd?: string;
  finalCharge?: number;
  // Breakdown — not shown to the customer, but persisted so the admin panel
  // can display the actual Shiprocket cost and delivery commission separately.
  shiprocketRate?: number;
  marginType?: "fixed" | "percentage";
  marginValue?: number;
  marginAmount?: number;
  codCharge?: number;
}

interface ShippingQuote {
  serviceable: boolean;
  totalShippingCharge: number;
  groups: ShippingQuoteGroup[];
}

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
  // Razorpay is the only checkout path.
  const [paymentMethod] = useState(PAYMENT_METHODS[0].id);
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

  const addressComplete = useMemo(
    () => address.fullName && address.line1 && address.city && address.state && address.postalCode && address.phone,
    [address]
  );

  // ── Shiprocket shipping quote: real serviceability + rate + admin margin ──
  // for the current pincode, re-fetched whenever the pincode or cart changes.
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const itemsKey = items.map(({ line }) => `${line.productId}:${line.quantity}`).join(",");

  useEffect(() => {
    setQuote(null);
    setQuoteError("");
    if (!/^\d{6}$/.test(address.postalCode) || items.length === 0) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      setQuoteLoading(true);
      fetch("/api/shiprocket/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ line, product }) => ({
            productId: line.productId,
            productName: product?.title ?? "",
            quantity: line.quantity,
            price: product?.price ?? 0,
          })),
          deliveryPincode: address.postalCode,
          isCOD: false,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (cancelled) return;
          if (!res.ok) {
            setQuoteError(data.error ?? "Could not check delivery for this address.");
          } else {
            setQuote(data);
          }
        })
        .catch(() => {
          if (!cancelled) setQuoteError("Could not check delivery for this address.");
        })
        .finally(() => {
          if (!cancelled) setQuoteLoading(false);
        });
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.postalCode, itemsKey]);

  const shippingReady = quote !== null && quote.serviceable;
  const shipping = shippingReady ? quote.totalShippingCharge : 0;
  const total = subtotal + shipping;

  /** Finalise the order in local state + Firestore after payment is confirmed. */
  const finaliseOrder = async (method: string) => {
    const orderId = generateOrderId();
    const now = new Date().toISOString();
    const auth = getFirebaseAuth();
    const firebaseUser = auth?.currentUser;

    addOrder({
      id: orderId,
      items: lines,
      address,
      paymentMethod: method,
      subtotal,
      total,
      placedAt: now,
      status: "Placed",
    });

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
      paymentMethod: method,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      shippingCharge: shipping,
      // Pre-quoted at checkout time (cheapest serviceable courier per vendor).
      // The admin ships each vendor's items separately and can pick a
      // different courier — the charge collected here doesn't change.
      shipments: (quote?.groups ?? [])
        .filter((g) => g.serviceable)
        .map((g) => ({
          vendorId: g.vendorId,
          vendorName: g.vendorName,
          status: "not_shipped" as const,
          courierName: g.courierName,
          etd: g.etd,
          finalCharge: g.finalCharge,
          shiprocketRate: g.shiprocketRate,
          marginType: g.marginType,
          marginValue: g.marginValue,
          marginAmount: g.marginAmount,
          codCharge: g.codCharge,
        })),
    });

    clearCart();
    router.push(`/checkout/confirmation?order=${orderId}`);
  };

  const [rzpError, setRzpError] = useState("");
  const [rzpLoading, setRzpLoading] = useState(false);

  const placeOrder = async () => {
    if (paymentMethod === "razorpay") {
      setRzpError("");
      setRzpLoading(true);
      try {
        // 1. Create order server-side (keeps secret safe)
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, currency: "INR" }),
        });
        const data = await res.json() as { orderId?: string; amount?: number; keyId?: string; error?: string };
        if (!res.ok || data.error) {
          setRzpError(data.error ?? "Could not create Razorpay order.");
          setRzpLoading(false);
          return;
        }

        // 2. Load Razorpay checkout.js if not already loaded
        if (!document.getElementById("rzp-script")) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.id = "rzp-script";
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
            document.head.appendChild(s);
          });
        }

        // 3. Open Razorpay modal
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          order_id: data.orderId,
          name: "Offerss.com",
          description: "Order Payment",
          prefill: {
            name: address.fullName,
            contact: address.phone,
          },
          theme: { color: "#f97316" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // Never trust the client — verify the signature server-side first.
            try {
              const vres = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const vdata = (await vres.json()) as { verified?: boolean; error?: string };
              if (!vres.ok || !vdata.verified) {
                setRzpError(vdata.error ?? "Payment could not be verified. If you were charged, it will be auto-refunded.");
                setRzpLoading(false);
                return;
              }
            } catch {
              setRzpError("Could not reach the verification server. Please contact support before paying again.");
              setRzpLoading(false);
              return;
            }
            // Signature verified — safe to record the order as paid.
            finaliseOrder("razorpay");
          },
          modal: {
            ondismiss: () => {
              setRzpLoading(false);
              setRzpError("Payment was cancelled.");
            },
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rzp.on("payment.failed", (resp: any) => {
          setRzpError(resp?.error?.description ?? "Payment failed. Please try another method.");
          setRzpLoading(false);
        });
        rzp.open();
        setRzpLoading(false);
      } catch (err) {
        setRzpError(err instanceof Error ? err.message : "Razorpay error. Try again.");
        setRzpLoading(false);
      }
      return;
    }

    // Non-Razorpay methods — existing mock flow
    await finaliseOrder(paymentMethod);
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
                // Skip the payment-method screen — open Razorpay straight away.
                void placeOrder();
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
                <input
                  required
                  inputMode="numeric"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  className="rounded-md border border-border px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-text">Phone</span>
                <input required type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="rounded-md border border-border px-3 py-2 text-sm" />
              </label>

              {/* Shipping serviceability — checked live against the entered pincode */}
              <div className="sm:col-span-2">
                {quoteLoading && (
                  <p className="rounded-md bg-surface-alt px-3 py-2 text-sm text-text-muted">Checking delivery availability…</p>
                )}
                {!quoteLoading && quoteError && (
                  <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{quoteError}</p>
                )}
                {!quoteLoading && quote && !quote.serviceable && (
                  <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                    <p className="font-medium">Shipping isn&apos;t available to this pincode:</p>
                    <ul className="list-disc pl-4 mt-1">
                      {quote.groups.filter((g) => !g.serviceable).map((g) => (
                        <li key={g.vendorId}>{g.reason ?? `${g.vendorName}'s items can't be delivered here.`}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {!quoteLoading && quote?.serviceable && (
                  <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                    <p className="font-medium">Delivery available — shipping {formatPrice(quote.totalShippingCharge)}</p>
                    {quote.groups.map((g) => (
                      <p key={g.vendorId} className="text-xs text-green-600">
                        {g.vendorName !== "Offerss.com" && <>{g.vendorName}: </>}
                        {g.courierName} &middot; by {g.etd ? new Date(g.etd).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex flex-col gap-2">
                <Button type="submit" disabled={!addressComplete || !shippingReady || rzpLoading || quoteLoading}>
                  {rzpLoading ? "Opening Razorpay…" : `Proceed to Pay ${formatPrice(total)}`}
                </Button>
                {rzpError && (
                  <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{rzpError}</p>
                )}
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3">
                <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8 shrink-0">
                  <rect width="40" height="40" rx="8" fill="#2563eb" />
                  <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#fff">Razor</text>
                  <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#fff">pay</text>
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text">Pay with Razorpay</span>
                  <span className="text-xs text-text-muted">Card &middot; UPI &middot; Wallet &middot; Netbanking</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                <Button variant="accent" onClick={placeOrder} disabled={rzpLoading}>
                  {rzpLoading ? "Opening Razorpay…" : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
              {rzpError && (
                <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{rzpError}</p>
              )}
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
              {rzpError && (
                <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{rzpError}</p>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button variant="accent" onClick={placeOrder} disabled={rzpLoading}>
                  {rzpLoading ? "Opening payment…" : "Place Order"}
                </Button>
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
            <span>
              {quoteLoading ? "Checking…" : shippingReady ? formatPrice(shipping) : "Enter pincode"}
            </span>
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
