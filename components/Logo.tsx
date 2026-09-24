"use client";

import Image from "next/image";
import { brand } from "@/lib/products";
import { useImageFailed } from "./ImageWithFallback";

export default function Logo({
  size = "md",
  light = false,
}: {
  size?: "md" | "lg";
  light?: boolean;
}) {
  const { ref, failed, onError } = useImageFailed();

  const height = size === "lg" ? 88 : 36;

  if (failed) {
    return (
      <span
        className={`font-serif tracking-tight ${light ? "text-white" : "text-ink"} ${
          size === "lg" ? "text-5xl md:text-6xl" : "text-2xl"
        }`}
      >
        Lumière<span className="text-rose-gold">.</span>
      </span>
    );
  }

  return (
    <Image
      ref={ref}
      src={brand.logo}
      alt={brand.name}
      width={height * 4}
      height={height}
      style={{ height, width: "auto" }}
      onError={onError}
      priority
    />
  );
}
