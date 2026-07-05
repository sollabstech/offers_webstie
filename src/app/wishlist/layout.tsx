import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Products you've saved for later on Offerss.com.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
