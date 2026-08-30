import Link from "next/link";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Offerss.com home"
      className={`shrink-0 ${className ?? ""}`}
    >
      <Image
        src="/banner-logo.png"
        alt="Offerss.com"
        width={300}
        height={80}
        className="h-20 w-auto object-contain"
        priority
        style={{
          mixBlendMode: "screen",
          filter: "brightness(1.1) saturate(1.2) drop-shadow(0 0 4px rgba(255,138,0,0.35))",
        }}
      />
    </Link>
  );
}
