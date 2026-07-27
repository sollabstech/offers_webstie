"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { categoryImageUrl } from "@/data/imageKeywords";

interface FirestoreBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkHref: string;
  active: boolean;
  order: number;
}

const FALLBACK_SLIDES = [
  { id: "hero-1", title: "Big Deals on Electronics", imageUrl: categoryImageUrl("electronics", 1600, 500), linkHref: "/category/electronics" },
  { id: "hero-2", title: "Refresh Your Home", imageUrl: categoryImageUrl("home", 1600, 500), linkHref: "/category/home" },
  { id: "hero-3", title: "New Season Fashion", imageUrl: categoryImageUrl("fashion", 1600, 500), linkHref: "/category/fashion" },
];

function BannerSlide({ banner }: { banner: { id: string; title: string; imageUrl: string; linkHref: string } }) {
  const inner = (
    <div className="relative h-48 w-full sm:h-64 md:h-80">
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized={banner.imageUrl.startsWith("http") && !banner.imageUrl.includes("unsplash.com") && !banner.imageUrl.includes("placehold.co")}
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
  ) : inner;
}

export default function BannerCarousel() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    async function init() {
      try {
        const { isFirebaseConfigured } = await import("@/lib/firebase");
        if (!isFirebaseConfigured()) return;

        const { getFirestore, collection, query, orderBy, onSnapshot, where } = await import("firebase/firestore");
        const { getApp } = await import("firebase/app");
        const firestoreDb = getFirestore(getApp());

        unsub = onSnapshot(
          query(collection(firestoreDb, "banners"), where("active", "==", true), orderBy("order", "asc")),
          (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBanner));
            if (data.length > 0) setSlides(data);
          },
          () => {} // silently ignore errors (e.g. missing index) and keep fallback
        );
      } catch {
        // Firebase not available — use fallback
      }
    }

    void init();
    return () => unsub?.();
  }, []);

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
