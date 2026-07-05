import { Check } from "lucide-react";
import { cn } from "@/utils/format";

const STEPS = ["Address", "Payment", "Review"] as const;

export default function CheckoutStepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {STEPS.map((step, i) => (
        <li key={step} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              i < current ? "bg-success text-white" : i === current ? "bg-primary text-white" : "bg-surface-alt text-text-muted"
            )}
          >
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          <span className={cn("text-sm", i === current ? "font-semibold text-text" : "text-text-muted")}>
            {step}
          </span>
          {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-border" />}
        </li>
      ))}
    </ol>
  );
}
