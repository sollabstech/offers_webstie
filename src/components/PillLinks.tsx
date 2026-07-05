import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import { categoryImageUrl } from "@/data/imageKeywords";

/** Horizontal row of circular category quick links; scrolls on mobile. */
export default function PillLinks() {
  return (
    <div className="flex gap-4 overflow-x-auto px-1 py-2 no-scrollbar">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/category/${cat.slug}`} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-surface-alt">
            <Image
              src={categoryImageUrl(cat.slug, 128, 128)}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <span className="line-clamp-2 text-xs text-text">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
