import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order on Offerss.com. Demo checkout — no real payment is collected.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
