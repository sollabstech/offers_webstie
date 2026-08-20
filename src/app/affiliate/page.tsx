"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

/* ─── Commission table ──────────────────────────────────────── */
const COMMISSION_TABLE = [
  { category: "Fashion",           rate: "25%" },
  { category: "Baby Products",     rate: "25%" },
  { category: "Home & Kitchen",    rate: "25%" },
  { category: "Electronics",       rate: "10%" },
  { category: "Beauty",            rate: "25%" },
  { category: "Footwear",          rate: "10%" },
  { category: "Grocery",           rate:  "6%" },
];

/* ─── Agreement clauses ─────────────────────────────────────── */
const CLAUSES = [
  ["1. Purpose", "The Seller agrees to list and sell products on Offerss.com. Offerss.com provides an online marketplace connecting sellers with customers and does not purchase or own the Seller's inventory."],
  ["2. Seller Responsibilities", "Supply genuine products · Maintain accurate inventory · Dispatch orders within the agreed timeline · Pack products securely · Comply with applicable laws and regulations · Provide accurate product descriptions and images · Handle warranty obligations where applicable."],
  ["3. Offerss.com Responsibilities", "Provide an online marketplace · Display the Seller's products · Process customer payments · Provide order notifications · Facilitate customer support for marketplace-related issues · Transfer payments after deducting applicable charges."],
  ["4. Payment Settlement", "Settlement will be made every 7/15 days after successful delivery, subject to deductions for Marketplace Commission, Payment Gateway Charges, Shipping Charges (if applicable), Taxes, and Returns or Refund Adjustments. Payments will be credited to the Seller's registered bank account."],
  ["5. Returns & Refunds", "If a customer returns a product in accordance with the Offerss.com Return Policy, the refund will be processed to the customer. The Seller agrees to accept eligible returns. Commission adjustments will be made where applicable."],
  ["6. Cancellation", "The Seller may cancel an order only in exceptional circumstances such as product out of stock, pricing error, or product damaged before dispatch. Frequent cancellations may affect Seller performance."],
  ["7. Product Quality", "The Seller guarantees that all products are genuine, new (unless clearly stated otherwise), safe for consumer use, free from legal disputes, and not counterfeit."],
  ["8. Intellectual Property", "The Seller confirms they have the right to use all product images, brand names, logos, and descriptions provided for listing on Offerss.com."],
  ["9. Prohibited Products", "The Seller shall not list products prohibited by law or by Offerss.com policies, including counterfeit goods, illegal items, hazardous materials, or restricted products."],
  ["10. Confidentiality", "Both parties agree to keep confidential any non-public business information shared under this Agreement."],
  ["11. Termination", "Offerss.com may suspend or terminate the Seller account for reasons including fraud, sale of counterfeit products, excessive customer complaints, repeated policy violations, or non-compliance with this Agreement."],
  ["12. Limitation of Liability", "Offerss.com acts only as an online marketplace and is not responsible for product quality, warranties, or manufacturing defects. The Seller remains responsible for compliance with applicable laws relating to the products sold."],
  ["13. Governing Law", "This Agreement shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts agreed by the parties."],
];

/* ─── Clause accordion item ─────────────────────────────────── */
function ClauseItem({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-text hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={16} className="shrink-0 text-text-muted" /> : <ChevronDown size={16} className="shrink-0 text-text-muted" />}
      </button>
      {open && <p className="pb-3 text-sm text-text-muted leading-relaxed">{body}</p>}
    </div>
  );
}

/* ─── Contact form (shown after agreeing) ───────────────────── */
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", business: "", mobile: "", email: "", gst: "", address: "", message: "",
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={44} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-text">Application Submitted! 🎉</h3>
        <p className="text-text-muted max-w-sm text-sm">
          Thank you for your interest in partnering with Offerss.com. Our team will review your details and contact you within <strong>2–3 business days</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 w-full max-w-sm text-sm">
          <div className="rounded-xl border border-border bg-white p-4 text-left">
            <p className="text-xs text-text-muted">Email</p>
            <p className="font-semibold text-text">sellers@offerss.com</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 text-left">
            <p className="text-xs text-text-muted">Phone</p>
            <p className="font-semibold text-text">+91 98765 43210</p>
          </div>
        </div>
        <Link href="/" className="rounded-full bg-accent px-7 py-2.5 font-semibold text-sm text-white hover:bg-accent-dark transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800 font-medium">
        ✅ Agreement accepted. Please fill in your details to complete your affiliate / vendor application.
      </div>

      {/* Offerss contact info */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Phone,   label: "Call Us",       value: "+91 98765 43210" },
          { icon: Mail,    label: "Email",          value: "sellers@offerss.com" },
          { icon: MapPin,  label: "Office",         value: "Mumbai, Maharashtra, India" },
          { icon: Clock,   label: "Support Hours",  value: "Mon–Sat, 9 AM – 6 PM" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted">{label}</p>
              <p className="text-xs font-semibold text-text">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Application form */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-base font-bold text-text">Your Application Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "name",     label: "Full Name",      type: "text",  required: true  },
            { key: "business", label: "Business Name",  type: "text",  required: true  },
            { key: "mobile",   label: "Mobile Number",  type: "tel",   required: true  },
            { key: "email",    label: "Email Address",  type: "email", required: true  },
            { key: "gst",      label: "GST Number",     type: "text",  required: false },
            { key: "address",  label: "City / Address", type: "text",  required: false },
          ].map(({ key, label, type, required }) => (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={`af_${key}`} className="text-sm font-medium text-text">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={`af_${key}`}
                type={type}
                required={required}
                value={form[key as keyof typeof form]}
                onChange={set(key as keyof typeof form)}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}
          <div className="sm:col-span-2 flex flex-col gap-1">
            <label htmlFor="af_message" className="text-sm font-medium text-text">Message / Product Category Interest</label>
            <textarea
              id="af_message"
              rows={3}
              value={form.message}
              onChange={set("message")}
              placeholder="Tell us about what you sell or your interest in partnering with Offerss.com..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!form.name || !form.mobile || !form.email) {
              alert("Please fill in all required fields.");
              return;
            }
            setSubmitted(true);
          }}
          className="mt-5 w-full rounded-full bg-accent py-3 font-bold text-white hover:bg-accent-dark transition-colors"
        >
          Submit Application →
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function AffiliatePage() {
  const [agreed, setAgreed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent mb-3">
          🤝 Seller Commission Agreement
        </span>
        <h1 className="text-3xl font-bold text-text">Offerss.com Seller Agreement</h1>
        <p className="mt-2 text-text-muted text-sm">
          Read the full commission agreement below, then accept to submit your application.
        </p>
      </div>

      {!showForm ? (
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8 space-y-6">
          {/* Parties */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
            <p className="text-sm font-bold text-primary mb-3">Agreement Parties</p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="font-semibold text-text">Offerss.com</p>
                <p className="text-text-muted text-xs mt-0.5">("Marketplace" / "Offerss")</p>
                <p className="text-text-muted text-xs">Mumbai, Maharashtra, India</p>
              </div>
              <div>
                <p className="font-semibold text-text">Seller</p>
                <p className="text-text-muted text-xs mt-0.5">As per details provided during onboarding</p>
              </div>
            </div>
          </div>

          {/* Commission table */}
          <div>
            <p className="text-sm font-bold text-text mb-3">📊 Commission Structure</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-2.5 text-left font-semibold">Category</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Commission (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMISSION_TABLE.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? "bg-white" : "bg-surface-alt"}>
                      <td className="px-4 py-2.5 text-text">{row.category}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-primary">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-text-muted">Commission percentages may be revised with prior written notice.</p>
          </div>

          {/* Clauses accordion */}
          <div>
            <p className="text-sm font-bold text-text mb-3">📋 Agreement Terms</p>
            <div className="rounded-xl border border-border bg-white px-4 divide-y divide-border">
              {CLAUSES.map(([title, body]) => (
                <ClauseItem key={title} title={title} body={body} />
              ))}
            </div>
          </div>

          {/* Acceptance section */}
          <div className="rounded-xl border border-border bg-white p-5 space-y-4">
            <p className="text-sm font-bold text-text">✍️ Acceptance</p>
            <div className="text-xs text-text-muted space-y-1">
              <p><strong>For Offerss.com</strong> — Authorized Signatory: <span className="text-text">Offerss.com Management</span></p>
              <p>Date: <span className="text-text">As of agreement acceptance</span></p>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-alt p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-primary shrink-0"
              />
              <span className="text-sm text-text">
                I, the Seller, have read, understood, and agree to the <strong>Offerss.com Seller Commission Agreement</strong> in its entirety, including all commission terms, return policy, payment cycle, prohibited products, and marketplace rules.
              </span>
            </label>
            <button
              type="button"
              disabled={!agreed}
              onClick={() => setShowForm(true)}
              className="w-full rounded-full bg-accent py-3 font-bold text-white transition hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              I Agree & Continue →
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8">
          <ContactForm />
        </div>
      )}

      {/* Bottom CTA */}
      {!showForm && (
        <p className="mt-6 text-center text-sm text-text-muted">
          Want to start selling?{" "}
          <Link href="/sell" className="font-semibold text-accent hover:underline">
            Go to Seller Onboarding →
          </Link>
        </p>
      )}
    </main>
  );
}
