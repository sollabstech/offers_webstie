import { cn } from "@/utils/format";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "accent" | "success" | "neutral";
  className?: string;
}

export default function Badge({ children, tone = "accent", className }: BadgeProps) {
  const tones: Record<string, string> = {
    accent: "bg-accent text-white",
    success: "bg-success text-white",
    neutral: "bg-surface-alt text-text-muted border border-border",
  };
  return (
    <span
      className={cn(
        "inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
