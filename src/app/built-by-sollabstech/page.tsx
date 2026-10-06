import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  Shield,
  Smartphone,
  LayoutDashboard,
  Search,
  Heart,
  Package,
  CreditCard,
  Globe,
  ArrowUpRight,
  Code2,
  Layers,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Built by Sollabstech | Offerss.com",
  description:
    "Offerss.com — a full-featured e-commerce platform designed and developed by Sollabstech. Visit sollabstech.com to see more of our work.",
};

const FEATURES = [
  {
    icon: ShoppingCart,
    title: "Full Shopping Experience",
    desc: "Cart, wishlist, multi-step checkout with address management, and order confirmation — end-to-end purchase flow.",
  },
  {
    icon: Shield,
    title: "Firebase Phone Auth",
    desc: "OTP-based phone authentication with invisible reCAPTCHA, gracefully degraded when unconfigured.",
  },
  {
    icon: Search,
    title: "Search & Discovery",
    desc: "Live search with debounce, category browsing, filter sidebar, and pill-based quick-nav links.",
  },
  {
    icon: Heart,
    title: "Wishlist & Personalisation",
    desc: "Persistent wishlist and cart state via Zustand stores backed by localStorage.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Panel",
    desc: "Separate back-office application with dashboard, product/category/order/user/vendor/analytics management.",
  },
  {
    icon: Package,
    title: "Product Catalogue",
    desc: "Type-safe data layer with accessor functions — swappable for a real backend without touching UI components.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    desc: "Mobile-first layout with a sticky bottom tab bar on small screens and adaptive navigation.",
  },
  {
    icon: CreditCard,
    title: "Checkout Flow",
    desc: "Multi-step checkout with delivery address auto-fill, order summary, and confirmation screen.",
  },
];

const TECH = [
  { name: "Next.js 16", detail: "App Router + Turbopack" },
  { name: "TypeScript", detail: "End-to-end type safety" },
  { name: "Tailwind CSS v4", detail: "CSS-variable theming" },
  { name: "Zustand", detail: "Client state management" },
  { name: "Firebase", detail: "Phone Auth + Firestore" },
  { name: "Lucide React", detail: "Icon system" },
];

export default function BuiltBySollabstechPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-primary text-white">
        {/* decorative grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center">
          {/* badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Code2 size={14} className="text-accent" />
            Designed &amp; Developed by
          </span>

          <h1 className="mb-3 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Sollab<span className="text-accent">s</span>tech
          </h1>

          <p className="mx-auto mb-2 max-w-xl text-lg text-white/70">
            This website —{" "}
            <span className="font-semibold text-white">Offerss.com</span> — was
            designed, engineered, and launched by the team at Sollabstech.
          </p>

          <a
            href="https://www.sollabstech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 mt-1 inline-flex items-center gap-1.5 text-accent hover:underline text-base font-semibold"
          >
            <Globe size={16} />
            www.sollabstech.com
            <ArrowUpRight size={14} />
          </a>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://www.sollabstech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark active:scale-95"
            >
              Visit Sollabstech
              <ArrowUpRight size={16} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              Explore the Store
            </Link>
          </div>
        </div>
      </section>

      {/* ── About this project ── */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                The Project
              </p>
              <h2 className="mb-4 text-3xl font-bold text-text">
                Offerss.com — Full-Stack E-Commerce Platform
              </h2>
              <p className="mb-4 leading-relaxed text-text-muted">
                Offerss.com is a complete multi-vendor marketplace built from
                the ground up. It covers every layer of a modern e-commerce
                product: a consumer-facing storefront, a vendor portal, and a
                powerful administration panel.
              </p>
              <p className="leading-relaxed text-text-muted">
                Every screen, every interaction, and every line of code was
                crafted by <span className="font-semibold text-text">Sollabstech</span> — a
                product studio specialising in scalable web and mobile
                applications.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "2", label: "Next.js Apps" },
                { value: "30+", label: "Pages Built" },
                { value: "6", label: "Tech Stack Layers" },
                { value: "100%", label: "Custom Design" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-surface-alt p-5 text-center"
                >
                  <p className="text-3xl font-extrabold text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
            What We Built
          </p>
          <h2 className="text-2xl font-bold text-text">
            Everything Under the Hood
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 inline-flex rounded-lg bg-primary-light p-2.5">
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="mb-1.5 font-semibold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="bg-surface-alt py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
              Technology
            </p>
            <h2 className="text-2xl font-bold text-text">
              Built With Modern Tools
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TECH.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-surface px-4 py-4 text-center shadow-sm"
              >
                <p className="font-semibold text-text text-sm">{t.name}</p>
                <p className="mt-1 text-xs text-text-muted">{t.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "App Router",
              "Server Components",
              "Turbopack",
              "CSS Variables",
              "OTP Auth",
              "Zustand Persist",
              "Firestore",
              "Lucide Icons",
              "Responsive Design",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sollabstech CTA ── */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-white text-center shadow-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
          />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
              <Layers size={26} className="text-accent" />
            </div>

            <h2 className="mb-3 text-3xl font-bold">
              Need a product like this?
            </h2>
            <p className="mx-auto mb-2 max-w-xl text-white/75">
              Sollabstech builds world-class web and mobile products — from
              e-commerce platforms and SaaS dashboards to Flutter apps and
              custom APIs.
            </p>
            <a
              href="https://www.sollabstech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex items-center gap-1.5 text-accent hover:underline font-semibold text-sm"
            >
              <Globe size={14} />
              www.sollabstech.com
            </a>

            <div className="mx-auto mb-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
              {[
                { icon: Zap, label: "Fast Delivery" },
                { icon: CheckCircle2, label: "Production-Ready Code" },
                { icon: Smartphone, label: "Web & Mobile" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 font-medium"
                >
                  <Icon size={15} className="text-accent" />
                  {label}
                </div>
              ))}
            </div>

            <a
              href="https://www.sollabstech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-accent-dark active:scale-95"
            >
              Get in Touch with Sollabstech
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
