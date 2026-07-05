import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "View your Offerss.com order history.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
