import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev badge — it overlaps the mobile bottom tab bar.
  devIndicators: false,
  images: {
    // Serve images straight from their source. Vercel's optimizer is metered and
    // returns 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) once the plan quota is used up.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
