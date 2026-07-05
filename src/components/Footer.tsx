"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "About Offerss.com",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press releases", href: "/press" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Connect with us",
    links: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "X / Twitter", href: "https://x.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on Offerss.com", href: "/sell" },
      { label: "Become an affiliate", href: "/affiliate" },
      { label: "Advertise your products", href: "/advertise" },
      { label: "Fulfilment services", href: "/fulfilment" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", href: "/account" },
      { label: "Your Orders", href: "/orders" },
      { label: "Shipping rates & policies", href: "/help/shipping" },
      { label: "Returns & replacements", href: "/help/returns" },
      { label: "Help Center", href: "/help" },
    ],
  },
];

/** Multi-column footer with a back-to-top bar and legal bottom bar; collapses to an accordion on mobile. */
export default function Footer() {
  return (
    <footer className="mt-10 bg-primary text-white">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex w-full items-center justify-center gap-2 bg-primary-dark py-3 text-sm hover:bg-primary-dark/80"
      >
        <ArrowUp size={16} />
        Back to top
      </button>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="hidden grid-cols-4 gap-6 md:grid">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/80 hover:text-accent hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divide-y divide-white/15 md:hidden">
          {COLUMNS.map((col) => (
            <details key={col.title} className="group py-3">
              <summary className="cursor-pointer list-none text-sm font-semibold">
                {col.title}
              </summary>
              <ul className="mt-2 space-y-2 pl-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/80 hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>

      <div className="border-t border-white/15 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-xs text-white/70 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Offerss.com. All rights reserved. Demo storefront — not a real retailer.</p>
          <div className="flex gap-4">
            <span>English - United States</span>
            <span>$ USD</span>
            <Link href="/legal/privacy" className="hover:text-accent">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-accent">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
