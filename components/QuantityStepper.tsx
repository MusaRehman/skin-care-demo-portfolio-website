"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/context/CartContext";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm"
      ? "h-8 w-8"
      : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-full border border-sand-300 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btn} flex items-center justify-center rounded-full text-ink transition hover:bg-sand-100 disabled:opacity-30`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={`${size === "sm" ? "w-6 text-sm" : "w-8"} text-center font-medium tabular-nums`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btn} flex items-center justify-center rounded-full text-ink transition hover:bg-sand-100 disabled:opacity-30`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
