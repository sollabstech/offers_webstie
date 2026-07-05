/**
 * Curated, hand-verified real stock photos (Unsplash), keyed by category slug.
 * Automatic keyword-based photo lookups (e.g. LoremFlickr tag search) were tried first
 * but produced irrelevant results (a "Furniture" tile returning a photo of trash on a
 * sidewalk, "Decor" returning street graffiti, etc). Each URL below was visually
 * confirmed to show the right kind of product before being added here.
 * TODO: remove once real category/product imagery is uploaded via the future admin panel.
 */
const CATEGORY_IMAGE_IDS: Record<string, string> = {
  electronics: "1498049794561-7780e7231661",
  "electronics-phones": "1511707171634-5f897ff02aa9",
  "electronics-laptops": "1496181133206-80ce9b88a853",
  "electronics-audio": "1505740420928-5e560c06d30e",
  "electronics-tv": "1593359677879-a4bb92f829d1",
  home: "1567016432779-094069958ea5",
  "home-furniture": "1555041469-a586c61ea9bc",
  "home-decor": "1513519245088-0e12902e5a38",
  "home-kitchen": "1556909212-d5b604d0c90d",
  "home-storage": "1594026112284-02bb6f3352fe",
  fashion: "1567401893414-76b7b1e5a7a5",
  "fashion-men": "1516257984-b1b4d707412e",
  "fashion-women": "1595777457583-95e059d581b8",
  "fashion-shoes": "1542291026-7eec264c27ff",
  "fashion-bags": "1584917865442-de89df76afd3",
  beauty: "1522335789203-aabd1fc54bc9",
  "beauty-skincare": "1556228720-195a672e8a03",
  "beauty-haircare": "1526947425960-945c6e72858f",
  "beauty-makeup": "1596462502278-27bfdc403348",
  sports: "1534438327276-14e5300c3a48",
  "sports-fitness": "1517836357463-d25dfeac3438",
  "sports-camping": "1504280390367-361c6d9f38f4",
  "sports-cycling": "1485965120184-e220f721d03e",
  toys: "1587654780291-39c9404d746b",
  "toys-kids": "1587654780291-39c9404d746b",
  "toys-boardgames": "1610890716171-6b1bb98ffd09",
  grocery: "1542838132-92c53300491e",
  "grocery-snacks": "1621939514649-280e2ee25f60",
  "grocery-beverages": "1544145945-f90425340c7e",
  books: "1495446815901-a7297e633e8d",
  "books-fiction": "1495446815901-a7297e633e8d",
  "books-office": "1568205612837-017257d2310a",
};

const FALLBACK_ID = "1498049794561-7780e7231661";

/** Returns a sized Unsplash photo URL for a category slug, cropped to the given dimensions. */
export function categoryImageUrl(slug: string, width = 400, height = 400): string {
  const id = CATEGORY_IMAGE_IDS[slug] ?? FALLBACK_ID;
  return `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&q=80`;
}
