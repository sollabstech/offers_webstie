import type { Category } from "@/types";

/**
 * Original placeholder category tree used to drive navigation and the mega menu.
 * TODO: replace with real category data / API response before production launch.
 */
export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    children: [
      { id: "electronics-phones", name: "Phones & Accessories", slug: "electronics-phones" },
      { id: "electronics-laptops", name: "Laptops & Computers", slug: "electronics-laptops" },
      { id: "electronics-audio", name: "Audio & Headphones", slug: "electronics-audio" },
      { id: "electronics-tv", name: "TV & Home Theater", slug: "electronics-tv" },
    ],
  },
  {
    id: "home",
    name: "Home & Kitchen",
    slug: "home",
    children: [
      { id: "home-furniture", name: "Furniture", slug: "home-furniture" },
      { id: "home-decor", name: "Decor", slug: "home-decor" },
      { id: "home-kitchen", name: "Kitchen & Dining", slug: "home-kitchen" },
      { id: "home-storage", name: "Storage & Organization", slug: "home-storage" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    children: [
      { id: "fashion-men", name: "Men's Clothing", slug: "fashion-men" },
      { id: "fashion-women", name: "Women's Clothing", slug: "fashion-women" },
      { id: "fashion-shoes", name: "Shoes", slug: "fashion-shoes" },
      { id: "fashion-bags", name: "Bags & Accessories", slug: "fashion-bags" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    slug: "beauty",
    children: [
      { id: "beauty-skincare", name: "Skincare", slug: "beauty-skincare" },
      { id: "beauty-haircare", name: "Hair Care", slug: "beauty-haircare" },
      { id: "beauty-makeup", name: "Makeup", slug: "beauty-makeup" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    slug: "sports",
    children: [
      { id: "sports-fitness", name: "Fitness Equipment", slug: "sports-fitness" },
      { id: "sports-camping", name: "Camping & Hiking", slug: "sports-camping" },
      { id: "sports-cycling", name: "Cycling", slug: "sports-cycling" },
    ],
  },
  {
    id: "toys",
    name: "Toys & Games",
    slug: "toys",
    children: [
      { id: "toys-kids", name: "Kids Toys", slug: "toys-kids" },
      { id: "toys-boardgames", name: "Board Games", slug: "toys-boardgames" },
    ],
  },
  {
    id: "grocery",
    name: "Grocery",
    slug: "grocery",
    children: [
      { id: "grocery-snacks", name: "Snacks", slug: "grocery-snacks" },
      { id: "grocery-beverages", name: "Beverages", slug: "grocery-beverages" },
    ],
  },
  {
    id: "books",
    name: "Books & Stationery",
    slug: "books",
    children: [
      { id: "books-fiction", name: "Fiction", slug: "books-fiction" },
      { id: "books-office", name: "Office Supplies", slug: "books-office" },
    ],
  },
];

export const topLevelCategories = categories;

export function findCategoryBySlug(slug: string): Category | undefined {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    const child = cat.children?.find((c) => c.slug === slug);
    if (child) return child;
  }
  return undefined;
}
