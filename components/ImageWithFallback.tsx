"use client";

import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// An image can fail before hydration attaches onError, but a pending image can also
// report complete with no size, so re-request it to tell the two apart.
export function useImageFailed() {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (!img || !img.complete || img.naturalWidth > 0) return;
    const probe = new window.Image();
    probe.onerror = () => setFailed(true);
    probe.src = img.currentSrc || img.src;
    return () => {
      probe.onerror = null;
    };
  }, []);

  return { ref, failed, onError: () => setFailed(true) };
}

type Props = Omit<ImageProps, "onError"> & {
  fallbackLabel?: string;
  fallbackClassName?: string;
  hideFallbackIcon?: boolean;
};

export default function ImageWithFallback({
  fallbackLabel,
  fallbackClassName = "from-sand-100 to-sand-200",
  hideFallbackIcon = false,
  alt,
  className,
  ...props
}: Props) {
  const { ref, failed, onError } = useImageFailed();

  if (failed) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${fallbackClassName}`}
        role="img"
        aria-label={alt}
      >
        {!hideFallbackIcon && (
          <div className="rounded-full bg-white/60 p-3 text-sand-400 backdrop-blur">
            <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
        {fallbackLabel && (
          <span className="px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted/70">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      alt={alt}
      className={className}
      onError={onError}
      {...props}
    />
  );
}
