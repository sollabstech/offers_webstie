"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import MobileDrawer from "@/components/ui/MobileDrawer";

type SortKey = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

const PAGE_SIZE = 12;

interface ProductListingProps {
  heading: string;
  products: Product[];
}

/** Shared listing UI for Category and Search Results pages: filters, sort, grid, pagination. */
export default function ProductListing({ heading, products }: ProductListingProps) {
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map((p) => p.price), 100)), [products]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceCeiling, setPriceCeiling] = useState(maxPrice);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.price <= priceCeiling &&
        p.rating >= minRating &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = [...list].sort((a, b) => (a.id < b.id ? 1 : -1));
        break;
      default:
        break;
    }
    return list;
  }, [products, priceCeiling, minRating, selectedBrands, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filterProps = {
    brands,
    selectedBrands,
    onToggleBrand: toggleBrand,
    maxPrice,
    priceCeiling,
    onPriceCeilingChange: (v: number) => {
      setPriceCeiling(v);
      setPage(1);
    },
    minRating,
    onMinRatingChange: (v: number) => {
      setMinRating(v);
      setPage(1);
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">{heading}</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-muted">{filtered.length} results</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
            >
              <option value="relevance">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <FilterSidebar {...filterProps} />
        </aside>

        <div className="flex-1">
          <ProductGrid products={pageItems} />

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-current={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-md text-sm ${
                    page === i + 1 ? "bg-primary text-white" : "border border-border text-text hover:bg-surface-alt"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <MobileDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" side="bottom">
        <div className="p-4">
          <FilterSidebar {...filterProps} />
        </div>
      </MobileDrawer>
    </div>
  );
}
