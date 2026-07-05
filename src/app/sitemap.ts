import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const SITE_URL = "https://www.offerss.com"; // TODO: replace with real production domain

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/cart", "/checkout", "/account", "/account/login", "/orders", "/wishlist", "/search"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const categoryRoutes = categories.flatMap((cat) => [
    { url: `${SITE_URL}/category/${cat.slug}`, lastModified: new Date() },
    ...(cat.children ?? []).map((child) => ({
      url: `${SITE_URL}/category/${child.slug}`,
      lastModified: new Date(),
    })),
  ]);

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
