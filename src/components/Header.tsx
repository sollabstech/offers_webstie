"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, User, Package, ShoppingCart, Menu } from "lucide-react";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import MobileDrawer from "@/components/ui/MobileDrawer";
import { useCartStore } from "@/store/cartStore";
import { useHasMounted } from "@/hooks/useHasMounted";
import { categories } from "@/data/categories";

/** Sticky site header: logo, delivery indicator, search, account/orders/cart, category row. */
export default function Header() {
  const storeTotalItems = useCartStore((s) => s.totalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // The cart count is persisted to localStorage, so it can differ from the
  // server-rendered value. Show 0 until after the first client render to
  // avoid a hydration mismatch, then reveal the real (possibly persisted) count.
  const mounted = useHasMounted();
  const totalItems = mounted ? storeTotalItems : 0;

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <button
          type="button"
          className="p-1 md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Logo className="shrink-0" />

        <Link
          href="/account"
          className="hidden shrink-0 items-center gap-1 text-xs leading-tight hover:text-accent md:flex"
        >
          <MapPin size={16} />
          <span>
            Deliver to
            <br />
            <strong>New York 10001</strong>
          </span>
        </Link>

        <SearchBar className="mx-1 hidden flex-1 md:flex" />

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              className="flex items-center gap-1 text-xs leading-tight hover:text-accent"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
            >
              <User size={18} />
              <span>
                Hello, sign in
                <br />
                <strong>Account &amp; Lists</strong>
              </span>
            </button>
            {accountOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-md border border-border bg-surface p-3 text-text shadow-lg"
              >
                <Link href="/account/login" className="block rounded bg-accent px-3 py-2 text-center text-sm text-white hover:bg-accent-dark">
                  Sign in
                </Link>
                <p className="mt-2 text-xs text-text-muted">
                  New customer? <Link href="/account/login" className="text-primary underline">Start here</Link>
                </p>
                <hr className="my-2 border-border" />
                <Link href="/account" className="block py-1 text-sm hover:text-primary">Your Account</Link>
                <Link href="/orders" className="block py-1 text-sm hover:text-primary">Your Orders</Link>
                <Link href="/wishlist" className="block py-1 text-sm hover:text-primary">Your Wishlist</Link>
              </div>
            )}
          </div>

          <Link href="/orders" className="hidden text-xs leading-tight hover:text-accent lg:block">
            Returns
            <br />
            <strong>&amp; Orders</strong>
          </Link>

          <Link href="/cart" aria-label={`Cart, ${totalItems} items`} className="relative flex items-center gap-1 hover:text-accent">
            <span className="relative">
              <ShoppingCart size={26} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            </span>
            <span className="hidden text-sm font-semibold lg:block">Cart</span>
          </Link>
        </div>
      </div>

      <div className="px-4 pb-2 md:hidden">
        <SearchBar />
      </div>

      <CategoryNav />

      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} title="Menu" side="left">
        <div className="p-4">
          <Link
            href="/account/login"
            onClick={() => setMobileMenuOpen(false)}
            className="mb-4 flex items-center gap-2 rounded-md bg-primary-light px-3 py-2 text-sm font-medium text-primary"
          >
            <User size={18} /> Sign in / Register
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-text"
          >
            <Package size={18} /> Your Orders
          </Link>
          <h3 className="mb-2 text-xs font-semibold uppercase text-text-muted">Shop by category</h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-sm text-text"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </MobileDrawer>
    </header>
  );
}
