import type { MetadataRoute } from "next";

const SITE_URL = "https://www.offerss.com"; // TODO: replace with real production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/account", "/orders"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
