import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // Curated real (royalty-free) stock photos used for demo/placeholder product & category imagery.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // TODO: remove once the admin panel replaces this temporary imported product.
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
};

export default nextConfig;
