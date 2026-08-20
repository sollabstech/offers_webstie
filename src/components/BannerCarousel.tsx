"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";

interface FirestoreBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkHref: string;
  active: boolean;
  order: number;
}

function BannerSlide({ banner }: { banner: FirestoreBanner }) {
  const inner = (
    <div className="relative h-48 w-full sm:h-64 md:h-80">
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized={
          banner.imageUrl.startsWith("data:") ||
          (banner.imageUrl.startsWith("http") &&
            !banner.imageUrl.includes("unsplash.com") &&
            !banner.imageUrl.includes("placehold.co"))
        }
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-center px-6 sm:px-10">
        <h2 className="max-w-md text-2xl font-bold text-white drop-shadow sm:text-3xl md:text-4xl">
          {banner.title}
        </h2>
      </div>
    </div>
  );

  return banner.linkHref ? (
    <Link href={banner.linkHref} className="block">{inner}</Link>
  ) : <>{inner}</>;
}

export default function BannerCarousel() {
  const [slides, setSlides] = useState<FirestoreBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    async function init() {
      try {
        const { isFirebaseConfigured } = await import("@/lib/firebase");
        if (!isFirebaseConfigured()) {
          setLoading(false);
          return;
        }

        const { getFirestore, collection, query, where, onSnapshot } = await import("firebase/firestore");
        const { getApp } = await import("firebase/app");
        const firestoreDb = getFirestore(getApp());

        // Simple query — no orderBy to avoid composite index requirement; sort client-side
        unsub = onSnapshot(
          query(collection(firestoreDb, "banners"), where("active", "==", true)),
          (snap) => {
            const data = snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as FirestoreBanner))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setSlides(data);
            setLoading(false);
          },
          () => { setLoading(false); }
        );
      } catch {
        setLoading(false);
      }
    }

    void init();
    return () => unsub?.();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="h-48 w-full animate-pulse rounded-xl bg-surface-alt sm:h-64 md:h-80" />
    );
  }

  // No banners in admin — show nothing
  if (slides.length === 0) {
    return null;
  }

  return (
    <Carousel
      className="h-48 sm:h-64 md:h-80"
      slides={slides.map((slide) => ({
        id: slide.id,
        content: <BannerSlide banner={slide} />,
      }))}
    />
  );
}
