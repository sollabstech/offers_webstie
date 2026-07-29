import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MessageCircle, Clock, MapPin, Truck, RotateCcw, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | Offerss.com",
  description: "Get help with your orders, returns, shipping, and more. Contact Offerss.com support.",
};

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 98765 43210",
    sub: "Mon – Sat, 9 AM – 8 PM IST",
    href: "tel:+919876543210",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@offerss.com",
    sub: "We reply within 24 hours",
    href: "mailto:support@offerss.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+91 98765 43210",
    sub: "Quick replies on WhatsApp",
    href: "https://wa.me/919876543210",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const QUICK_LINKS = [
  { icon: Truck, label: "Shipping Rates & Policies", href: "/help/shipping" },
  { icon: RotateCcw, label: "Returns & Replacements", href: "/help/returns" },
  { icon: HelpCircle, label: "FAQs", href: "#faq" },
];

const FAQS = [
  {
    q: "How do I track my order?",
    a: "After placing an order, go to Your Orders and click on the order to see real-time tracking updates.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled within 1 hour of placing them. Go to Your Orders → select the order → Cancel Order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept PhonePe, Google Pay, Paytm, Net Banking, Credit/Debit cards, and Cash on Delivery.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available in metro cities.",
  },
  {
    q: "What is the return policy?",
    a: "Most items can be returned within 10 days of delivery. Visit our Returns page for full details.",
  },
  {
    q: "How do I become a seller on Offerss.com?",
    a: "Visit our 'Sell on Offerss.com' page or email us at vendor@offerss.com to get started.",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <div className="mb-10 rounded-2xl bg-primary px-8 py-10 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
        <p className="text-white/80 text-sm">Our support team is here for you — reach us anytime.</p>
      </div>

      {/* Contact cards */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONTACT_CHANNELS.map(({ icon: Icon, title, detail, sub, href, color }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-text">{title}</p>
                <p className="text-sm font-medium text-primary mt-0.5">{detail}</p>
                <p className="text-xs text-text-muted mt-0.5">{sub}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Company info + quick links */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Company info */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Company Information</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-text">Offerss.com Pvt. Ltd.</p>
                <p className="text-text-muted">123, Tech Park, Anna Nagar,<br />Chennai, Tamil Nadu – 600040, India</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-primary shrink-0" />
              <a href="mailto:support@offerss.com" className="text-primary hover:underline">support@offerss.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-primary shrink-0" />
              <a href="mailto:vendor@offerss.com" className="text-text-muted hover:underline">vendor@offerss.com <span className="text-xs">(Vendor enquiries)</span></a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <p className="text-text-muted">Support hours: Mon – Sat, 9 AM – 8 PM IST</p>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Quick Links</h2>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <Link href={href} className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-alt transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">{label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/orders" className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-alt transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">Track My Order</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-lg font-semibold text-text mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-border bg-surface">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text list-none">
                {q}
                <span className="ml-4 shrink-0 text-text-muted transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="border-t border-border px-5 py-4 text-sm text-text-muted">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
