import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { categoryImageUrl } from "@/data/imageKeywords";

interface CategoryCardModuleProps {
  title: string;
  tiles: { label: string; href: string; slug: string }[];
  seeMoreHref: string;
}

/** Merchandising card module: title, 2x2 image tile grid, and a "See more" link. */
export default function CategoryCardModule({ title, tiles, seeMoreHref }: CategoryCardModuleProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 text-base font-semibold text-text">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {tiles.slice(0, 4).map((tile) => (
          <Link key={tile.label} href={tile.href} className="group">
            <div className="relative aspect-square overflow-hidden rounded-md bg-surface-alt">
              <Image
                src={categoryImageUrl(tile.slug, 300, 300)}
                alt={tile.label}
                fill
                sizes="150px"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <p className="mt-1 truncate text-xs text-text-muted group-hover:text-primary">{tile.label}</p>
          </Link>
        ))}
      </div>
      <Link href={seeMoreHref} className="mt-3 text-sm font-medium text-primary hover:underline">
        See more
      </Link>
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
