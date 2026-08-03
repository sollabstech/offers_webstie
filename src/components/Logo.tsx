import Link from "next/link";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Offerss.com home" className={className}>
      <div className="rounded-xl bg-white px-3 py-1">
        <Image src="/banner-logo.png" alt="Offerss.com" width={160} height={45} className="h-9 w-auto" priority />
      </div>
    </Link>
  );
}
