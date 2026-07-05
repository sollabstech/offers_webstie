import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

/** Renders a 5-star rating with optional review count, accessible via aria-label. */
export default function RatingStars({ rating, reviewCount, size = 14 }: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars${
        reviewCount !== undefined ? `, ${reviewCount} reviews` : ""
      }`}
    >
      <div className="flex text-accent">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />;
          if (i === full && hasHalf)
            return <StarHalf key={i} size={size} fill="currentColor" strokeWidth={0} />;
          return <Star key={i} size={size} className="text-border" fill="currentColor" strokeWidth={0} />;
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-text-muted">{reviewCount.toLocaleString()}</span>
      )}
    </div>
  );
}
