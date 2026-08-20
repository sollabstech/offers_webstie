"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import MobileDrawer from "@/components/ui/MobileDrawer";

interface FirestoreSubcategory {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface FirestoreCategory {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  order: number;
  subcategories?: FirestoreSubcategory[];
}

/** Second-row category navigation — reads active categories live from Firestore. */
export default function CategoryNav() {
  const [cats, setCats] = useState<FirestoreCategory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let unsub: (() => void) | null = null;

    async function init() {
      try {
        const { isFirebaseConfigured } = await import("@/lib/firebase");
        if (!isFirebaseConfigured()) return;

        const { getFirestore, collection, query, where, onSnapshot } = await import("firebase/firestore");
        const { getApp } = await import("firebase/app");
        const db = getFirestore(getApp());

        unsub = onSnapshot(
          query(collection(db, "categories"), where("active", "==", true)),
          (snap) => {
            const data = snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as FirestoreCategory))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setCats(data);
          },
          () => { /* silent fail */ }
        );
      } catch {
        // Firebase not available — nav stays empty
      }
    }

    void init();
    return () => unsub?.();
  }, []);

  return (
    <nav aria-label="Category navigation" className="border-b border-border bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 overflow-x-auto px-4 py-2 no-scrollbar">
        {cats.map((cat) => {
          const active = pathname === `/category/${cat.slug}`;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-0.5 text-sm font-medium transition-all ${
                active
                  ? "bg-accent text-white"
                  : "hover:bg-white/15 hover:text-accent"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Shop by category" side="left">
        <ul className="divide-y divide-border">
          {cats.map((cat) => {
            const activeSubs = (cat.subcategories ?? []).filter((s) => s.active);
            return (
              <li key={cat.id}>
                {activeSubs.length > 0 ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-text">
                      {cat.name}
                      <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                    </summary>
                    <ul className="bg-surface-alt pb-2">
                      {activeSubs.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/category/${sub.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block px-8 py-2 text-sm text-text-muted hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-text hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </MobileDrawer>
    </nav>
  );
}
