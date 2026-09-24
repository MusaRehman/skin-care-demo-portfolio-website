"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Product } from "@/lib/products";
import ImageWithFallback from "./ImageWithFallback";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addItem, openCart } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 shadow-soft transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              fallbackClassName={product.accent}
              fallbackLabel={product.subtitle}
            />
          </div>
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur">
              {product.badge}
            </span>
          )}
          <button
            type="button"
            aria-label={`Add ${product.name} to bag`}
            onClick={(e) => {
              e.preventDefault();
              addItem(product.slug);
              openCart();
            }}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-all duration-300 hover:bg-ink hover:text-white md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-gold">
            {product.subtitle}
          </p>
          <h3 className="mt-1.5 font-serif text-xl text-ink transition-colors group-hover:text-rose-gold-dark">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
