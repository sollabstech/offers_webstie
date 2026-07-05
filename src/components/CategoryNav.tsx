"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";
import MobileDrawer from "@/components/ui/MobileDrawer";

const QUICK_LINKS = categories.slice(0, 7);

/** Second-row category navigation: "All" mega menu trigger, quick links, and a promo banner link. */
export default function CategoryNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav aria-label="Category navigation" className="border-b border-border bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium hover:text-accent"
        >
          <Menu size={18} />
          All
        </button>

        {QUICK_LINKS.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="shrink-0 whitespace-nowrap text-sm hover:text-accent"
          >
            {cat.name}
          </Link>
        ))}

        <Link
          href="/category/deals"
          className="ml-auto hidden shrink-0 whitespace-nowrap text-sm font-semibold text-accent sm:block"
        >
          Today&apos;s Deals →
        </Link>
      </div>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Shop by category" side="left">
        <ul className="divide-y divide-border">
          {categories.map((cat) => (
            <li key={cat.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-text">
                  {cat.name}
                  <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                </summary>
                <ul className="bg-surface-alt pb-2">
                  {cat.children?.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/category/${child.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-8 py-2 text-sm text-text-muted hover:text-primary"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </MobileDrawer>
    </nav>
  );
}
