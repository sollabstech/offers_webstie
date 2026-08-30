"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Heart, Menu, Package } from "lucide-react";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import MobileDrawer from "@/components/ui/MobileDrawer";
import { useCartStore } from "@/store/cartStore";
import { useAddressStore } from "@/store/addressStore";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useAuthState } from "@/hooks/useAuthState";

/** Sticky site header: logo, delivery indicator, search, account/orders/cart, category row. */
export default function Header() {
  const storeTotalItems = useCartStore((s) => s.totalItems());
  const savedAddress = useAddressStore((s) => s.address);
  const { user, signOut } = useAuthState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountOpen]);

  // The cart count is persisted to localStorage, so it can differ from the
  // server-rendered value. Show 0 until after the first client render to
  // avoid a hydration mismatch, then reveal the real (possibly persisted) count.
  const mounted = useHasMounted();
  const totalItems = mounted ? storeTotalItems : 0;

  // Cart bounce animation when items are added
  const [cartBounce, setCartBounce] = useState(false);
  const prevTotalRef = useRef(totalItems);
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      {/* Main header row */}
      <div className="mx-auto max-w-7xl px-4 py-1">
        <div className="flex items-center gap-6">

          {/* Mobile hamburger */}
          <button
            type="button"
            className="shrink-0 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo — LEFT, bigger */}
          <Logo className="shrink-0" />

          {/* Search bar — wide center */}
          <div className="mx-6 hidden flex-1 md:block">
            <SearchBar />
          </div>

          {/* Right: Account | Wishlist | Cart with dividers */}
          <div className="ml-auto flex items-center md:ml-0">

            {/* Account */}
            <div ref={accountRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="group flex flex-col items-center gap-1 px-5 py-1 transition-all hover:text-accent"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <User size={26} strokeWidth={1.5} />
                <span className="text-xs font-semibold tracking-wide">
                  {user ? user.displayName?.split(" ")[0] ?? "Account" : "Account"}
                </span>
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border bg-surface p-4 text-text shadow-2xl"
                >
                  {user ? (
                    <>
                      <p className="mb-3 truncate text-xs font-medium text-text-muted">{user.email}</p>
                      <hr className="mb-3 border-border" />
                      <Link href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary"><User size={14} /> Your Account</Link>
                      <Link href="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary"><Package size={14} /> Your Orders</Link>
                      <Link href="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary"><Heart size={14} /> Wishlist</Link>
                      <hr className="my-3 border-border" />
                      <button
                        onClick={() => { void signOut(); setAccountOpen(false); }}
                        className="w-full rounded-xl bg-red-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-600"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/account/login" onClick={() => setAccountOpen(false)} className="block rounded-xl bg-accent px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-accent-dark">
                        Sign In
                      </Link>
                      <p className="mt-2 text-center text-xs text-text-muted">
                        New here? <Link href="/account/login" className="font-medium text-primary underline">Create account</Link>
                      </p>
                      <hr className="my-3 border-border" />
                      <Link href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary">Your Account</Link>
                      <Link href="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary">Your Orders</Link>
                      <Link href="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt hover:text-primary">Wishlist</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden h-10 w-px bg-white/20 lg:block" />

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="group hidden flex-col items-center gap-1 px-5 py-1 transition-all hover:text-accent lg:flex"
            >
              <Heart size={26} strokeWidth={1.5} />
              <span className="text-xs font-semibold tracking-wide">Wishlist</span>
            </Link>

            {/* Divider */}
            <div className="hidden h-10 w-px bg-white/20 lg:block" />

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart, ${totalItems} items`}
              className="group flex flex-col items-center gap-1 px-5 py-1 transition-all hover:opacity-80"
            >
              <div className="relative">
                <Image
                  src="/cart.png"
                  alt="Cart"
                  width={32}
                  height={32}
                  className={`h-7 w-7 object-contain transition-transform ${cartBounce ? "cart-bounce" : ""}`}
                />
                <span className={`absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1 transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}>
                  {totalItems}
                </span>
              </div>
              <span className="text-xs font-semibold tracking-wide">Cart</span>
            </Link>

          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-3 md:hidden">
          <SearchBar />
        </div>
      </div>

      <CategoryNav />

      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} title="Menu" side="left">
        <div className="p-4">
          {user ? (
            <button
              onClick={() => { void signOut(); setMobileMenuOpen(false); }}
              className="mb-4 flex w-full items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
            >
              <User size={18} /> Sign out ({user.displayName?.split(" ")[0] ?? "User"})
            </button>
          ) : (
            <Link
              href="/account/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mb-4 flex items-center gap-2 rounded-md bg-primary-light px-3 py-2 text-sm font-medium text-primary"
            >
              <User size={18} /> Sign in / Register
            </Link>
          )}
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-text"
          >
            <Package size={18} /> Your Orders
          </Link>
          <p className="text-xs text-text-muted">Browse categories from the top nav bar.</p>
        </div>
      </MobileDrawer>
    </header>
  );
}
