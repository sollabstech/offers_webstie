import type { Metadata } from "next";
import Link from "next/link";
import { Package, Heart, MapPin, LogIn } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Manage your Offerss.com account, orders, wishlist, and addresses.",
};

const TILES = [
  { href: "/orders", icon: Package, title: "Your Orders", description: "Track, return, or buy again" },
  { href: "/wishlist", icon: Heart, title: "Your Wishlist", description: "Items you've saved for later" },
  { href: "/account", icon: MapPin, title: "Addresses", description: "Edit shipping addresses (demo)" },
  { href: "/account/login", icon: LogIn, title: "Login & Security", description: "Sign in with your mobile number" },
];

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your Account" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Account</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5 hover:shadow-md"
          >
            <tile.icon className="text-primary" size={22} />
            <h2 className="text-sm font-semibold text-text">{tile.title}</h2>
            <p className="text-xs text-text-muted">{tile.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
