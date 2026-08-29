import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { categoryImageUrl } from "@/data/imageKeywords";

interface CategoryCardModuleProps {
  title: string;
  tiles: { label: string; href: string; slug: string }[];
  seeMoreHref: string;
  colorClass?: string;
}

/** Merchandising card module: title, 2x2 image tile grid, and a "See more" link. */
export default function CategoryCardModule({ title, tiles, seeMoreHref, colorClass = "from-primary to-primary-dark" }: CategoryCardModuleProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className={`bg-gradient-to-r ${colorClass} px-3 py-2 text-center`}>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <div className="grid grid-cols-2 gap-1.5">
          {tiles.slice(0, 4).map((tile) => (
            <Link key={tile.label} href={tile.href} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-alt">
                <Image
                  src={categoryImageUrl(tile.slug, 300, 300)}
                  alt={tile.label}
                  fill
                  sizes="150px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="mt-0.5 truncate text-center text-xs text-text-muted group-hover:text-primary">{tile.label}</p>
            </Link>
          ))}
        </div>
        <Link href={seeMoreHref} className="mt-2 block text-center text-sm font-medium text-accent hover:underline">
          See more →
        </Link>
      </div>
    </div>
  );
}

export function buildTilesFromCategory(category: Category) {
  return (category.children ?? []).map((child) => ({
    label: child.name,
    href: `/category/${child.slug}`,
    slug: child.slug,
  }));
}
