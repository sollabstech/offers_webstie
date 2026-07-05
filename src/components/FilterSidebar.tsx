"use client";

interface FilterSidebarProps {
  brands: string[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  maxPrice: number;
  priceCeiling: number;
  onPriceCeilingChange: (value: number) => void;
  minRating: number;
  onMinRatingChange: (value: number) => void;
}

/** Collapsible filter panel: price range, brand checkboxes, rating filter. */
export default function FilterSidebar({
  brands,
  selectedBrands,
  onToggleBrand,
  maxPrice,
  priceCeiling,
  onPriceCeilingChange,
  minRating,
  onMinRatingChange,
}: FilterSidebarProps) {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <details open className="group">
        <summary className="mb-2 cursor-pointer list-none text-sm font-semibold text-text">
          Price
        </summary>
        <div className="flex flex-col gap-2 pt-1">
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceCeiling}
            onChange={(e) => onPriceCeilingChange(Number(e.target.value))}
            aria-label="Maximum price"
          />
          <p className="text-text-muted">Up to ${priceCeiling.toFixed(0)}</p>
        </div>
      </details>

      <details open className="group">
        <summary className="mb-2 cursor-pointer list-none text-sm font-semibold text-text">
          Brand
        </summary>
        <ul className="flex flex-col gap-1.5 pt-1">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details open className="group">
        <summary className="mb-2 cursor-pointer list-none text-sm font-semibold text-text">
          Customer Rating
        </summary>
        <ul className="flex flex-col gap-1.5 pt-1">
          {[4, 3, 2, 1].map((r) => (
            <li key={r}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="min-rating"
                  checked={minRating === r}
                  onChange={() => onMinRatingChange(r)}
                />
                <span>{r} stars &amp; up</span>
              </label>
            </li>
          ))}
          <li>
            <label className="flex items-center gap-2">
              <input type="radio" name="min-rating" checked={minRating === 0} onChange={() => onMinRatingChange(0)} />
              <span>Any rating</span>
            </label>
          </li>
        </ul>
      </details>
    </div>
  );
}
