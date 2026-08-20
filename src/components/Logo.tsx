import Link from "next/link";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Offerss.com home" className={`shrink-0 ${className ?? ""}`}>
      <Image
        src="/banner-logo.png"
        alt="Offerss.com"
        width={220}
        height={60}
        className="h-14 w-auto object-contain"
        priority
        style={{ mixBlendMode: "screen" }}
      />
    </Link>
  );
}
