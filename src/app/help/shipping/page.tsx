import type { Metadata } from "next";
import { Truck, Clock, MapPin, Package, AlertCircle, CheckCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping Rates & Policies",
  description: "Learn about Offerss.com shipping rates, delivery timelines, and policies.",
};

const RATES = [
  { type: "Standard Delivery", time: "5–7 business days", cost: "Free on orders above ₹499", costAlt: "₹49 below ₹499" },
  { type: "Express Delivery", time: "2–3 business days", cost: "₹99 flat", costAlt: "" },
  { type: "Same-Day Delivery", time: "Within 24 hours", cost: "₹149 flat", costAlt: "Select cities only" },
  { type: "Scheduled Delivery", time: "Pick your date", cost: "₹79 flat", costAlt: "" },
];

const ZONES = [
  { zone: "Metro Cities", cities: "Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata", days: "2–4 days" },
  { zone: "Tier 2 Cities", cities: "Pune, Ahmedabad, Jaipur, Surat, Lucknow, Kochi", days: "4–6 days" },
  { zone: "Tier 3 & Rural", cities: "Rest of India", days: "6–10 days" },
];

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help", href: "/help" }, { label: "Shipping Rates & Policies" }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Shipping Rates & Policies</h1>
        <p className="text-text-muted">Everything you need to know about how we deliver your orders across India.</p>
      </div>

      {/* Delivery options */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <Truck size={20} className="text-primary" /> Delivery Options
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-text">Delivery Type</th>
                <th className="text-left px-5 py-3 font-semibold text-text">Timeline</th>
                <th className="text-left px-5 py-3 font-semibold text-text">Cost</th>
                <th className="text-left px-5 py-3 font-semibold text-text">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {RATES.map((r) => (
                <tr key={r.type}>
                  <td className="px-5 py-3 font-medium text-text">{r.type}</td>
                  <td className="px-5 py-3 text-text-muted">{r.time}</td>
                  <td className="px-5 py-3 font-semibold text-primary">{r.cost}</td>
                  <td className="px-5 py-3 text-text-muted">{r.costAlt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delivery zones */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-primary" /> Delivery Zones
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ZONES.map((z) => (
            <div key={z.zone} className="rounded-xl border border-border bg-surface p-5">
              <p className="font-semibold text-text mb-1">{z.zone}</p>
              <p className="text-xs text-text-muted mb-3">{z.cities}</p>
              <p className="text-sm font-medium text-primary flex items-center gap-1">
                <Clock size={13} /> {z.days}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracking */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <Package size={20} className="text-primary" /> Order Tracking
        </h2>
        <div className="rounded-xl border border-border bg-surface p-6 space-y-3 text-sm text-text-muted leading-relaxed">
          <p className="flex items-start gap-2"><CheckCircle size={15} className="text-success mt-0.5 shrink-0" /> Once your order is shipped, you will receive a tracking link via SMS and email.</p>
          <p className="flex items-start gap-2"><CheckCircle size={15} className="text-success mt-0.5 shrink-0" /> You can also track your order from <strong className="text-text">Your Orders</strong> section in your account.</p>
          <p className="flex items-start gap-2"><CheckCircle size={15} className="text-success mt-0.5 shrink-0" /> Live tracking is available for Express and Same-Day delivery orders.</p>
          <p className="flex items-start gap-2"><CheckCircle size={15} className="text-success mt-0.5 shrink-0" /> Tracking updates are refreshed every 2–4 hours for standard shipments.</p>
        </div>
      </section>

      {/* Important notes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-primary" /> Important Notes
        </h2>
        <ul className="rounded-xl border border-border bg-surface divide-y divide-border text-sm">
          {[
            "Delivery timelines are estimated and may vary during sale events, public holidays, or extreme weather.",
            "Orders placed before 2:00 PM are typically dispatched the same day (business days only).",
            "Delivery to remote PIN codes may take additional 2–3 days beyond the stated timeline.",
            "In case of a failed delivery attempt, our courier partner will retry up to 2 more times.",
            "If delivery fails after 3 attempts, the order will be returned to the vendor and a refund initiated.",
            "Cash on Delivery (COD) is available on orders up to ₹10,000 in eligible pin codes.",
          ].map((note, i) => (
            <li key={i} className="px-5 py-3 text-text-muted flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-primary font-bold">{i + 1}.</span> {note}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
