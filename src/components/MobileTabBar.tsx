"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingCart, User, type LucideIcon } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHasMounted } from "@/hooks/useHasMounted";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: Home, isActive: (p) => p === "/" },
  { href: "/search", label: "Search", icon: Search, isActive: (p) => p.startsWith("/search") },
  { href: "/wishlist", label: "Wishlist", icon: Heart, isActive: (p) => p.startsWith("/wishlist") },
  { href: "/cart", label: "Cart", icon: ShoppingCart, isActive: (p) => p.startsWith("/cart") },
  { href: "/account", label: "Account", icon: User, isActive: (p) => p.startsWith("/account") },
];

/**
 * App-style bottom tab bar. Mobile only (`md:hidden`) — desktop keeps the full
 * header. Fixed to the bottom with an iOS safe-area inset; the matching bottom
 * padding on <body> lives in app/layout.tsx.
 */
export default function MobileTabBar() {
  const pathname = usePathname();
  const mounted = useHasMounted();

  // Persisted (localStorage) counts — render 0 until mounted to avoid a
  // hydration mismatch, same pattern as the header cart badge.
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {TABS.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.icon;
          const badge = !mounted
            ? 0
            : tab.href === "/cart"
              ? cartCount
              : tab.href === "/wishlist"
                ? wishlistCount
                : 0;

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-text-muted"
                }`}
              >
                {active && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
                )}
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                  {badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-white">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
