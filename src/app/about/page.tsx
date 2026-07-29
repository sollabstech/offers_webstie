import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Store, Truck, HeadphonesIcon, TrendingUp, Users } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Offerss.com — India's trusted marketplace connecting buyers and verified vendors.",
};

const STATS = [
  { value: "10,000+", label: "Products Listed" },
  { value: "500+", label: "Verified Vendors" },
  { value: "1M+", label: "Happy Customers" },
  { value: "99.9%", label: "Uptime Reliability" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Trust & Safety", desc: "Every vendor is verified before listing products. We protect buyers with easy returns and secure payments." },
  { icon: Store, title: "Vendor Empowerment", desc: "We give local businesses and entrepreneurs a powerful platform to reach millions of customers across India." },
  { icon: Truck, title: "Fast Delivery", desc: "From order to doorstep — we partner with top logistics providers to ensure fast, reliable delivery nationwide." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our customer support team is always available to resolve your queries quickly and fairly." },
  { icon: TrendingUp, title: "Best Prices", desc: "We work directly with vendors to cut out the middlemen, so you always get the best deals and offers." },
  { icon: Users, title: "Community First", desc: "Offerss is built for both buyers and sellers — a fair, transparent marketplace where everyone wins." },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">About Offerss.com</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            India's trusted online marketplace — connecting millions of shoppers with hundreds of verified vendors, all in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

        {/* Who we are */}
        <section className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-text">Who We Are</h2>
            <p className="mb-4 text-text-muted leading-relaxed">
              Offerss.com was founded with a simple mission — make great products accessible to everyone at honest prices. We are a multi-vendor marketplace that brings together thousands of sellers and millions of buyers on a single, easy-to-use platform.
            </p>
            <p className="text-text-muted leading-relaxed">
              From electronics and fashion to home essentials and beauty products, Offerss covers every category you need — with real deals, verified sellers, and a shopping experience you can trust.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-5 text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor section */}
        <section className="mt-16 rounded-2xl bg-primary px-8 py-10 text-white text-center">
          <Store size={36} className="mx-auto mb-4 text-accent" />
          <h2 className="mb-3 text-2xl font-bold">Sell on Offerss.com</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/80">
            Are you a brand, manufacturer, or local business? Join our vendor network and reach millions of customers across India. Setting up your store takes less than 10 minutes.
          </p>
          <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            {["Easy Onboarding", "Low Commission Rates", "Real-time Analytics"].map((f) => (
              <div key={f} className="rounded-lg bg-white/10 px-4 py-3 font-medium">{f}</div>
            ))}
          </div>
          <Link
            href="/account/login"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Become a Vendor
          </Link>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">What We Stand For</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-surface p-5">
                <Icon size={22} className="mb-3 text-primary" />
                <h3 className="mb-1 font-semibold text-text">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
