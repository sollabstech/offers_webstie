"use client";

import { useState } from "react";
import { RefreshCw, RotateCcw, CheckCircle, XCircle, Clock, Package, AlertCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/ui/Button";

const RETURN_STEPS = [
  { step: "1", title: "Initiate Request", desc: "Go to Your Orders, select the item, and click 'Return or Replace'." },
  { step: "2", title: "Choose Reason", desc: "Select a reason — damaged, wrong item, not as described, or changed mind." },
  { step: "3", title: "Schedule Pickup", desc: "Our courier will pick up the item from your address within 2–3 days." },
  { step: "4", title: "Refund / Replacement", desc: "Once we receive and inspect the item, your refund or replacement is processed." },
];

const ELIGIBLE = [
  "Item received is damaged or defective",
  "Wrong item delivered",
  "Item not as described on the listing",
  "Missing parts or accessories",
  "Item not opened / unused (within return window)",
];

const NOT_ELIGIBLE = [
  "Items returned after the return window has closed",
  "Perishable goods (food, flowers, etc.)",
  "Digital downloads or software once activated",
  "Customised or personalised products",
  "Items damaged due to misuse by the customer",
  "Innerwear, swimwear, or earrings (hygiene reasons)",
];

const REFUND_TIMELINE = [
  { method: "UPI / PhonePe / GPay / Paytm", time: "1–2 business days" },
  { method: "Credit / Debit Card", time: "5–7 business days" },
  { method: "Net Banking", time: "3–5 business days" },
  { method: "Cash on Delivery (COD)", time: "5–7 business days (bank transfer)" },
  { method: "Offerss Wallet Credit", time: "Instant" },
];

const REASONS = [
  "Damaged or Defective",
  "Wrong item received",
  "Not as described",
  "Missing parts / accessories",
  "Changed my mind",
  "Better price available",
  "Other",
];

export default function ReturnsPage() {
  const [tab, setTab] = useState<"return" | "replace">("return");
  const [form, setForm] = useState({ orderId: "", reason: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help", href: "/help" }, { label: "Returns & Replacements" }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Returns & Replacements</h1>
        <p className="text-text-muted">Easy 10-day returns and hassle-free replacements on eligible items.</p>
      </div>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-5">How It Works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RETURN_STEPS.map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-surface p-5">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-3">
                {s.step}
              </div>
              <p className="font-semibold text-text mb-1">{s.title}</p>
              <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligible / Not eligible */}
      <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-success" /> Eligible for Return
          </h3>
          <ul className="space-y-2">
            {ELIGIBLE.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-text-muted">
                <CheckCircle size={13} className="text-success mt-0.5 shrink-0" /> {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
            <XCircle size={16} className="text-red-500" /> Not Eligible for Return
          </h3>
          <ul className="space-y-2">
            {NOT_ELIGIBLE.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-text-muted">
                <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" /> {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Refund timeline */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Refund Timeline
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-text">Payment Method</th>
                <th className="text-left px-5 py-3 font-semibold text-text">Refund Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {REFUND_TIMELINE.map((r) => (
                <tr key={r.method}>
                  <td className="px-5 py-3 text-text">{r.method}</td>
                  <td className="px-5 py-3 font-medium text-primary">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-text-muted">
          <AlertCircle size={13} className="text-accent shrink-0" />
          Refunds are processed after the returned item is received and inspected at our warehouse (typically 1–2 days after pickup).
        </p>
      </section>

      {/* Request form */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-5 flex items-center gap-2">
          <Package size={20} className="text-primary" /> Submit a Request
        </h2>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-border bg-surface-alt p-1 w-fit mb-6 gap-1">
          <button
            type="button"
            onClick={() => setTab("return")}
            className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium transition-colors ${
              tab === "return" ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            <RotateCcw size={14} /> Return
          </button>
          <button
            type="button"
            onClick={() => setTab("replace")}
            className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium transition-colors ${
              tab === "replace" ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            <RefreshCw size={14} /> Replace
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-14 text-center">
            <CheckCircle size={48} className="text-success" />
            <h3 className="text-xl font-semibold text-text">
              {tab === "return" ? "Return" : "Replacement"} Request Submitted!
            </h3>
            <p className="max-w-sm text-sm text-text-muted">
              We've received your request for order <strong>{form.orderId}</strong>. Our team will contact you within 24 hours to arrange pickup.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ orderId: "", reason: "", details: "" }); }}
              className="mt-2 text-sm text-primary underline hover:text-primary/80"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-6 space-y-5">
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-primary font-medium">
              {tab === "return"
                ? "Return window: 10 days from delivery date. Refund to original payment method."
                : "Replacement: We'll send a new item once we receive the original back. Same model / colour."}
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Order ID *</span>
              <input
                required
                value={form.orderId}
                onChange={(e) => set("orderId", e.target.value)}
                placeholder="e.g. ORD-1234567"
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Reason *</span>
              <select
                required
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface text-text"
              >
                <option value="">Select a reason</option>
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Additional Details <span className="text-text-muted font-normal">(optional)</span></span>
              <textarea
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                rows={3}
                placeholder="Describe the issue in more detail..."
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface resize-none"
              />
            </label>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Submitting…" : `Submit ${tab === "return" ? "Return" : "Replacement"} Request`}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
