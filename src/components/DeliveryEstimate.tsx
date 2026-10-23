"use client";

import { useState } from "react";
import { MapPin, Loader2, Zap, IndianRupee } from "lucide-react";

interface CourierOption {
  name: string;
  rate: number;
  etd: string;
  codAvailable: boolean;
  speedTier: "express" | "fast" | "standard";
}

interface Result {
  serviceable: boolean;
  codAvailable?: boolean;
  fastest?: CourierOption;
  cheapest?: CourierOption;
  error?: string;
}

const TIER_LABEL: Record<CourierOption["speedTier"], string> = {
  express: "Express",
  fast: "Fast",
  standard: "Standard",
};

function formatETD(etd: string) {
  try {
    return new Date(etd).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return etd;
  }
}

/** Pincode → delivery-estimate checker, backed by Shiprocket serviceability from this product's actual vendor pickup location. */
export default function DeliveryEstimate({ productId }: { productId: string }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const check = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({ serviceable: false, error: "Enter a valid 6-digit pincode." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/shiprocket/serviceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode, productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ serviceable: false, error: data.error ?? "Could not check delivery." });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ serviceable: false, error: "Could not check delivery." });
    } finally {
      setLoading(false);
    }
  };

  // Fastest and cheapest often coincide — only show the extra card if they differ.
  const showBoth =
    result?.serviceable && result.cheapest && result.fastest && result.cheapest.name !== result.fastest.name;

  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-text">
        <MapPin size={15} /> Check delivery date
      </p>
      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter pincode"
          inputMode="numeric"
          className="w-32 rounded-md border border-border px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Check"}
        </button>
      </div>

      {result?.error && <p className="mt-2 text-xs text-text-muted">{result.error}</p>}

      {result?.serviceable === false && !result.error && (
        <p className="mt-2 text-xs text-text-muted">Sorry, this item can&apos;t be delivered to that pincode.</p>
      )}

      {result?.serviceable && result.fastest && (
        <div className="mt-2.5 space-y-1.5">
          {[result.fastest, ...(showBoth ? [result.cheapest!] : [])].map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-surface-alt px-2.5 py-1.5 text-xs">
              <span className="flex items-center gap-1.5">
                <Zap size={11} className="text-primary" />
                <span className="font-medium text-text">{TIER_LABEL[c.speedTier]}</span>
                <span className="text-text-muted">by {formatETD(c.etd)}</span>
              </span>
              <span className="flex items-center font-semibold text-text">
                <IndianRupee size={10} />{c.rate}
              </span>
            </div>
          ))}
          {result.codAvailable && <p className="text-xs text-success">Cash on delivery available</p>}
        </div>
      )}
    </div>
  );
}
