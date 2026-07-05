import Link from "next/link";

/**
 * Text-based SVG wordmark placeholder for the Offerss.com brand.
 * TODO: replace with real logo asset (SVG/PNG) when final branding is approved.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Offerss.com home" className={className}>
      <svg width="150" height="32" viewBox="0 0 150 32" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <text x="0" y="23" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="800">
          <tspan fill="var(--color-accent)">Off</tspan>
          <tspan fill="var(--color-primary)">erss.com</tspan>
        </text>
      </svg>
      <span className="sr-only">Offerss.com</span>
    </Link>
  );
}
