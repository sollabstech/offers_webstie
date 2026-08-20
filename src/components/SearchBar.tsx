"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { products as staticProducts } from "@/data/products";
import { getFirestoreProducts } from "@/lib/firestoreProducts";
import type { Product } from "@/types";

interface FirestoreCategory { id: string; name: string; slug: string; order: number; }

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [scope, setScope] = useState("all");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [dropdownCats, setDropdownCats] = useState<FirestoreCategory[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Firestore categories for dropdown
  useEffect(() => {
    let unsub: (() => void) | null = null;
    async function init() {
      try {
        const { isFirebaseConfigured } = await import("@/lib/firebase");
        if (!isFirebaseConfigured()) return;
        const { getFirestore, collection, query: fsQuery, where, onSnapshot } = await import("firebase/firestore");
        const { getApp } = await import("firebase/app");
        const db = getFirestore(getApp());
        unsub = onSnapshot(
          fsQuery(collection(db, "categories"), where("active", "==", true)),
          (snap) => {
            const data = snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as FirestoreCategory))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setDropdownCats(data);
          },
          () => {}
        );
      } catch { /* silent */ }
    }
    void init();
    return () => unsub?.();
  }, []);

  // Load Firestore products once for suggestions
  useEffect(() => {
    getFirestoreProducts().then((fp) => {
      const staticIds = new Set(staticProducts.map((p) => p.id));
      setAllProducts([...staticProducts, ...fp.filter((p) => !staticIds.has(p.id))]);
    });
  }, []);

  // Compute suggestions from all products whenever query changes
  const q = query.trim().toLowerCase();
  const suggestions = q.length > 0
    ? allProducts.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.categorySlug?.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];

  const showDropdown = focused && suggestions.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const navigate = useCallback((q: string) => {
    setFocused(false);
    setQuery(q);
    const params = new URLSearchParams({ q });
    if (scope !== "all") params.set("category", scope);
    router.push(`/search?${params.toString()}`);
  }, [router, scope]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(suggestions[activeIndex].title);
    } else if (query.trim()) {
      navigate(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative flex w-full ${className ?? ""}`}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`flex w-full overflow-hidden rounded-full border-2 transition-all ${
          focused ? "border-accent shadow-lg shadow-accent/20" : "border-white/30 shadow-md"
        }`}
      >
        <label className="sr-only" htmlFor="search-category">Search category</label>
        <select
          id="search-category"
          value={scope}
          onChange={(e) => {
            const val = e.target.value;
            setScope(val);
            if (val === "all") router.push("/");
            else router.push(`/category/${val}`);
          }}
          className="hidden shrink-0 border-r border-border bg-surface-alt px-2 text-xs text-text-muted sm:block"
        >
          <option value="all">All categories</option>
          {dropdownCats.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-input">Search products</label>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and more..."
          className="w-full min-w-0 flex-1 bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted outline-none"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setQuery(""); setFocused(false); inputRef.current?.focus(); }}
            className="shrink-0 px-2 text-text-muted hover:text-text"
          >
            <X size={15} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className="shrink-0 bg-accent px-5 py-2 text-white hover:bg-accent-dark transition-colors"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showDropdown && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          {suggestions.map((product, i) => (
            <li
              key={product.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                navigate(product.title);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm ${
                i === activeIndex ? "bg-primary-light text-primary" : "text-text hover:bg-surface-alt"
              }`}
            >
              <Search size={13} className="shrink-0 text-text-muted" />
              {/* Highlight matching part */}
              <span className="flex-1 truncate">
                {product.title.toLowerCase().startsWith(query.toLowerCase()) ? (
                  <>
                    <strong>{product.title.slice(0, query.length)}</strong>
                    {product.title.slice(query.length)}
                  </>
                ) : (
                  product.title
                )}
              </span>
              <span className="shrink-0 text-xs text-text-muted">{product.categorySlug}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
