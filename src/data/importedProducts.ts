import type { Product } from "@/types";

/**
 * TEMPORARY: real product data (title, brand, images, specs, reviews) pulled from the
 * public DummyJSON product API (https://dummyjson.com/products/123) so the catalog has
 * at least one "real-looking" product with genuine photography instead of placeholder
 * blocks. This file exists only until the admin panel is built to manage products —
 * at that point, remove this file and load products from the real backend/admin data
 * instead.
 *
 * Source: GET https://dummyjson.com/products/123 (fetched manually, not a live call).
 */
export const importedProducts: Product[] = [
  {
    id: "imported-123",
    slug: "iphone-13-pro-imported",
    title: "iPhone 13 Pro",
    brand: "Apple",
    categorySlug: "electronics-phones",
    price: 996.72,
    originalPrice: 1099.99,
    currency: "USD",
    rating: 4.12,
    reviewCount: 3,
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp",
    ],
    description:
      "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.",
    specifications: {
      SKU: "SMA-APP-IPH-123",
      Weight: "8 oz",
      Dimensions: '12.63" x 5.28" x 14.29"',
      Warranty: "3 year warranty",
      Shipping: "Ships in 2 weeks",
      "Return Policy": "7 days return policy",
      Availability: "In Stock",
    },
    reviews: [
      {
        id: "imported-123-review-1",
        author: "Christian Perez",
        rating: 5,
        title: "Would buy again!",
        body: "Would buy again!",
        date: "2025-04-30",
        verified: true,
      },
      {
        id: "imported-123-review-2",
        author: "Liam Gonzalez",
        rating: 3,
        title: "Not worth the price!",
        body: "Not worth the price!",
        date: "2025-04-30",
        verified: true,
      },
      {
        id: "imported-123-review-3",
        author: "Tristan Scott",
        rating: 5,
        title: "Very satisfied!",
        body: "Very satisfied!",
        date: "2025-04-30",
        verified: true,
      },
    ],
    stock: 56,
    badge: "New",
    tags: ["smartphones", "apple", "imported"],
  },
];
