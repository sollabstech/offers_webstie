"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories } from "@/data/categories";

interface SearchBarProps {
  className?: string;
}

/** Central search bar with category scope dropdown, used in the header. */
export default function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [scope, setScope] = useState("all");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ q: query });
    if (scope !== "all") params.set("category", scope);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex w-full overflow-hidden rounded-md border transition-shadow ${
        focused ? "border-accent ring-2 ring-accent/30" : "border-border"
      } ${className ?? ""}`}
    >
      <label className="sr-only" htmlFor="search-category">
        Search category
      </label>
      <select
        id="search-category"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="hidden shrink-0 border-r border-border bg-surface-alt px-2 text-xs text-text-muted sm:block"
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="search-input">
        Search products
      </label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search products, brands and categories"
        className="w-full min-w-0 flex-1 bg-surface px-3 py-2 text-sm outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 bg-accent px-3 text-white hover:bg-accent-dark"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
