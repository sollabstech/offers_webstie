import type { Product, Review } from "@/types";
import { importedProducts } from "@/data/importedProducts";
import { categoryImageUrl } from "@/data/imageKeywords";

/**
 * Original placeholder product catalog for demo purposes only.
 * Images are hand-verified real stock photography (see src/data/imageKeywords.ts),
 * matched per category so products show a visually relevant photo instead of a plain
 * color block. All products in the same category currently share one curated photo.
 * TODO: replace with real per-product photography / API response before production launch.
 */

function makeReviews(productTitle: string, count: number, seed: number): Review[] {
  const authors = ["A. Sharma", "J. Lee", "M. Torres", "P. Novak", "S. Ibrahim", "R. Fontaine"];
  const templates = [
    { title: "Exactly as described", body: "Works great, matches the listing and arrived in good condition." },
    { title: "Good value", body: "Does what it says. Not premium but solid for the price point." },
    { title: "Would buy again", body: "Second time ordering this. Consistent quality." },
    { title: "A few nitpicks", body: "Overall fine, packaging could be better." },
    { title: "Better than expected", body: "Pleasantly surprised by the build quality." },
  ];
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const t = templates[(seed + i) % templates.length];
    reviews.push({
      id: `${productTitle}-review-${i}`,
      author: authors[(seed + i) % authors.length],
      rating: [5, 4, 5, 3, 4][(seed + i) % 5],
      title: t.title,
      body: t.body,
      date: new Date(2025, (seed + i) % 12, ((seed + i) % 27) + 1).toISOString().slice(0, 10),
      verified: (seed + i) % 3 !== 0,
    });
  }
  return reviews;
}

interface Seed {
  title: string;
  brand: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  badge?: Product["badge"];
  tags: string[];
  specifications: Record<string, string>;
  variants?: Product["variants"];
}

const SIZE_VARIANTS: Product["variants"] = ["S", "M", "L", "XL"].map((size) => ({
  id: `size-${size}`,
  label: size,
  type: "size",
  value: size,
}));

const SEEDS: Seed[] = [
  { title: "Wireless Over-Ear Headphones", brand: "Northline", categorySlug: "electronics-audio", price: 59.99, originalPrice: 89.99, badge: "Deal", tags: ["audio", "bluetooth"], specifications: { "Battery Life": "30 hrs", Connectivity: "Bluetooth 5.2", Weight: "250g" } },
  { title: "Noise Cancelling Earbuds", brand: "Northline", categorySlug: "electronics-audio", price: 39.5, badge: "Best Seller", tags: ["audio", "earbuds"], specifications: { "Battery Life": "6 hrs + case", Connectivity: "Bluetooth 5.3", "Water Resistance": "IPX4" } },
  { title: "27-inch 4K Monitor", brand: "Vistacore", categorySlug: "electronics-laptops", price: 249.0, originalPrice: 299.0, tags: ["monitor", "4k"], specifications: { Resolution: "3840x2160", "Refresh Rate": "60Hz", Panel: "IPS" } },
  { title: "Mechanical Keyboard, RGB", brand: "Keystroke", categorySlug: "electronics-laptops", price: 74.99, badge: "New", tags: ["keyboard", "gaming"], specifications: { Switches: "Blue Mechanical", Backlight: "RGB", Layout: "Full-size" } },
  { title: "Ergonomic Wireless Mouse", brand: "Keystroke", categorySlug: "electronics-laptops", price: 22.99, tags: ["mouse"], specifications: { DPI: "1600", Connectivity: "2.4GHz Wireless", Battery: "AA x1" } },
  { title: "Smartphone Stand & Charger", brand: "Northline", categorySlug: "electronics-phones", price: 18.99, tags: ["phone", "charging"], specifications: { Output: "15W Fast Charge", Compatibility: "Qi-enabled phones" } },
  { title: "6.7-inch Smartphone, 128GB", brand: "Corallis", categorySlug: "electronics-phones", price: 329.0, originalPrice: 389.0, badge: "Deal", tags: ["phone"], specifications: { Storage: "128GB", RAM: "6GB", Display: "6.7in AMOLED" } },
  { title: "55-inch 4K Smart TV", brand: "Vistacore", categorySlug: "electronics-tv", price: 399.0, originalPrice: 479.0, badge: "Deal", tags: ["tv"], specifications: { Resolution: "3840x2160", "Smart OS": "Included", "HDMI Ports": "4" } },
  { title: "Soundbar with Subwoofer", brand: "Northline", categorySlug: "electronics-tv", price: 129.0, tags: ["audio", "tv"], specifications: { Channels: "2.1", Connectivity: "HDMI ARC, Bluetooth" } },
  { title: "3-Seat Fabric Sofa", brand: "Homeward", categorySlug: "home-furniture", price: 549.0, tags: ["furniture", "sofa"], specifications: { Material: "Woven Fabric", Frame: "Solid Wood", Dimensions: '84" x 35" x 33"' } },
  { title: "Adjustable Office Chair", brand: "Homeward", categorySlug: "home-furniture", price: 149.99, badge: "Best Seller", tags: ["furniture", "office"], specifications: { "Weight Capacity": "300 lbs", Material: "Mesh Back", Adjustable: "Height, Tilt, Arms" } },
  { title: "Set of 3 Wall Art Canvases", brand: "Homeward", categorySlug: "home-decor", price: 34.99, tags: ["decor"], specifications: { Material: "Canvas Print", "Frame Included": "Yes" } },
  { title: "Ceramic Table Lamp", brand: "Lumenhaus", categorySlug: "home-decor", price: 27.5, tags: ["decor", "lighting"], specifications: { Material: "Ceramic + Linen Shade", "Bulb Type": "E26 (not included)" } },
  { title: "12-Piece Non-Stick Cookware Set", brand: "Kitchenly", categorySlug: "home-kitchen", price: 89.99, originalPrice: 129.99, badge: "Deal", tags: ["kitchen", "cookware"], specifications: { Material: "Aluminum, Non-stick Coating", "Oven Safe": "Up to 350F" } },
  { title: "Stainless Steel Knife Set", brand: "Kitchenly", categorySlug: "home-kitchen", price: 44.99, tags: ["kitchen"], specifications: { Pieces: "6", Material: "Stainless Steel", "Block Included": "Yes" } },
  { title: "Stackable Storage Bins (Set of 4)", brand: "Homeward", categorySlug: "home-storage", price: 24.99, tags: ["storage"], specifications: { Material: "Polypropylene", Capacity: "20L each" } },
  { title: "Men's Slim Fit Chinos", brand: "Everwear", categorySlug: "fashion-men", price: 29.99, tags: ["men", "pants"], specifications: { Material: "98% Cotton, 2% Spandex", Fit: "Slim" }, variants: SIZE_VARIANTS },
  { title: "Men's Crewneck Sweater", brand: "Everwear", categorySlug: "fashion-men", price: 25.0, originalPrice: 35.0, badge: "Deal", tags: ["men", "knitwear"], specifications: { Material: "Cotton Blend", Care: "Machine Washable" }, variants: SIZE_VARIANTS },
  { title: "Women's Wrap Midi Dress", brand: "Aurelle", categorySlug: "fashion-women", price: 42.0, badge: "New", tags: ["women", "dress"], specifications: { Material: "Viscose", Fit: "Regular" }, variants: SIZE_VARIANTS },
  { title: "Women's High-Rise Jeans", brand: "Aurelle", categorySlug: "fashion-women", price: 38.0, tags: ["women", "denim"], specifications: { Material: "Denim, 2% Elastane", Rise: "High" }, variants: SIZE_VARIANTS },
  { title: "Running Shoes, Breathable Mesh", brand: "Strideline", categorySlug: "fashion-shoes", price: 54.99, originalPrice: 69.99, badge: "Best Seller", tags: ["shoes", "running"], specifications: { "Upper Material": "Mesh", "Sole": "EVA Foam", Closure: "Lace-up" }, variants: ["7", "8", "9", "10", "11"].map((s) => ({ id: `size-${s}`, label: s, type: "size" as const, value: s })) },
  { title: "Classic Leather Sneakers", brand: "Strideline", categorySlug: "fashion-shoes", price: 64.0, tags: ["shoes"], specifications: { "Upper Material": "Synthetic Leather", Closure: "Lace-up" } },
  { title: "Canvas Tote Bag", brand: "Aurelle", categorySlug: "fashion-bags", price: 16.99, tags: ["bags"], specifications: { Material: "Cotton Canvas", Dimensions: '15" x 16" x 5"' } },
  { title: "Leather Crossbody Bag", brand: "Aurelle", categorySlug: "fashion-bags", price: 48.0, badge: "New", tags: ["bags"], specifications: { Material: "Genuine Leather", Strap: "Adjustable" } },
  { title: "Vitamin C Brightening Serum", brand: "Purelume", categorySlug: "beauty-skincare", price: 19.99, tags: ["skincare"], specifications: { Volume: "30ml", "Skin Type": "All" } },
  { title: "Hydrating Face Moisturizer", brand: "Purelume", categorySlug: "beauty-skincare", price: 14.99, originalPrice: 19.99, badge: "Deal", tags: ["skincare"], specifications: { Volume: "50ml", "Skin Type": "Dry, Normal" } },
  { title: "Argan Oil Hair Mask", brand: "Silkstrand", categorySlug: "beauty-haircare", price: 12.5, tags: ["haircare"], specifications: { Volume: "200ml", "Hair Type": "All" } },
  { title: "12-Shade Eyeshadow Palette", brand: "Glamora", categorySlug: "beauty-makeup", price: 17.99, badge: "New", tags: ["makeup"], specifications: { Shades: "12", Finish: "Matte & Shimmer" } },
  { title: "Adjustable Dumbbell Set", brand: "Ironforge", categorySlug: "sports-fitness", price: 119.0, originalPrice: 149.0, badge: "Deal", tags: ["fitness"], specifications: { "Weight Range": "5-25 lbs each", Material: "Rubber Coated" } },
  { title: "Yoga Mat with Carry Strap", brand: "Ironforge", categorySlug: "sports-fitness", price: 21.99, tags: ["fitness", "yoga"], specifications: { Thickness: "6mm", Material: "TPE" } },
  { title: "4-Person Camping Tent", brand: "Trailmark", categorySlug: "sports-camping", price: 89.99, tags: ["camping"], specifications: { Capacity: "4 Person", "Waterproof Rating": "3000mm" } },
  { title: "Insulated Camping Cooler 25L", brand: "Trailmark", categorySlug: "sports-camping", price: 34.99, tags: ["camping"], specifications: { Capacity: "25L", "Ice Retention": "48 hrs" } },
  { title: "Road Bike Helmet", brand: "Velocore", categorySlug: "sports-cycling", price: 27.5, tags: ["cycling"], specifications: { Sizes: "S/M/L", Ventilation: "18 vents" } },
  { title: "Bike Repair Tool Kit", brand: "Velocore", categorySlug: "sports-cycling", price: 15.99, tags: ["cycling"], specifications: { Pieces: "16-in-1", Case: "Included" } },
  { title: "Wooden Building Blocks Set", brand: "Playmint", categorySlug: "toys-kids", price: 23.99, badge: "Best Seller", tags: ["toys", "kids"], specifications: { Pieces: "100", "Age Range": "3+" } },
  { title: "Remote Control Racing Car", brand: "Playmint", categorySlug: "toys-kids", price: 32.99, tags: ["toys"], specifications: { "Battery Life": "45 min", Speed: "15 mph" } },
  { title: "Strategy Board Game", brand: "Tablegame Co.", categorySlug: "toys-boardgames", price: 29.99, badge: "New", tags: ["games"], specifications: { Players: "2-4", "Play Time": "45 min" } },
  { title: "Trail Mix Variety Pack (12ct)", brand: "Harvest Row", categorySlug: "grocery-snacks", price: 18.5, tags: ["snacks"], specifications: { Count: "12 packs", "Net Weight": "24 oz total" } },
  { title: "Sparkling Water Variety Pack (24ct)", brand: "Harvest Row", categorySlug: "grocery-beverages", price: 14.99, tags: ["beverages"], specifications: { Count: "24 cans", Flavors: "4 assorted" } },
  { title: "Hardcover Mystery Novel", brand: "Penbound Press", categorySlug: "books-fiction", price: 13.99, tags: ["books"], specifications: { Pages: "352", Format: "Hardcover" } },
  { title: "Desk Organizer Set", brand: "Officemate", categorySlug: "books-office", price: 16.99, tags: ["office"], specifications: { Pieces: "5", Material: "Mesh Metal" } },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const seedProducts: Product[] = SEEDS.map((seed, index) => {
  const slug = slugify(seed.title);
  const rating = Math.round((3.6 + ((index * 7) % 14) / 10) * 10) / 10;
  const reviewCount = 8 + ((index * 13) % 240);
  return {
    id: `p${index + 1}`,
    slug,
    title: seed.title,
    brand: seed.brand,
    categorySlug: seed.categorySlug,
    price: seed.price,
    originalPrice: seed.originalPrice,
    currency: "USD",
    rating: Math.min(rating, 5),
    reviewCount,
    images: [800, 700, 900].map((size) => categoryImageUrl(seed.categorySlug, size, size)),
    description: `${seed.title} from ${seed.brand}. Designed for everyday reliability and value. This is original placeholder marketing copy for demo purposes.`,
    specifications: seed.specifications,
    variants: seed.variants,
    reviews: makeReviews(slug, Math.min(6, reviewCount), index),
    stock: 5 + ((index * 17) % 60),
    badge: seed.badge,
    tags: seed.tags,
  };
});

// TODO: remove `importedProducts` once the admin panel manages the real catalog.
export const products: Product[] = [...seedProducts, ...importedProducts];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export const trendingProducts = products.filter((_, i) => i % 3 === 0);
export const dealProducts = products.filter((p) => p.badge === "Deal");
