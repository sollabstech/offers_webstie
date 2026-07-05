"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
}

export default function QuantityStepper({ quantity, onChange, max = 10, min = 1 }: QuantityStepperProps) {
  return (
    <div className="flex items-center rounded-md border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="p-2 text-text-muted hover:text-text disabled:opacity-40"
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-medium">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="p-2 text-text-muted hover:text-text disabled:opacity-40"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
