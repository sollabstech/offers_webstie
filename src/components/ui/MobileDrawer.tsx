"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/format";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
}

/** Slide-in drawer used for the mega-menu, filters, and cart/menu overlays on mobile. */
export default function MobileDrawer({ open, onClose, title, side = "left", children }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelPosition = {
    left: "left-0 top-0 h-full w-80 max-w-[85vw] animate-fade-in",
    right: "right-0 top-0 h-full w-80 max-w-[85vw] animate-fade-in",
    bottom: "bottom-0 left-0 w-full max-h-[85vh] rounded-t-xl animate-fade-in",
  }[side];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn("absolute flex flex-col bg-surface shadow-xl", panelPosition)}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button type="button" aria-label="Close menu" onClick={onClose} className="p-1 text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
