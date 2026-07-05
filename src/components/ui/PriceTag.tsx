import { formatPrice, discountPercent } from "@/utils/format";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
}

export default function PriceTag({ price, originalPrice, currency = "USD", size = "md" }: PriceTagProps) {
  const percent = discountPercent(price, originalPrice);
  const priceSize = { sm: "text-base", md: "text-lg", lg: "text-2xl" }[size];

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-semibold text-text ${priceSize}`}>{formatPrice(price, currency)}</span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-text-muted line-through">
          {formatPrice(originalPrice, currency)}
        </span>
      )}
      {percent && <span className="text-sm font-medium text-success">-{percent}%</span>}
    </div>
  );
}
