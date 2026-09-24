"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, Check, ShieldCheck, Star, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, products, type Product } from "@/lib/products";
import ImageWithFallback from "./ImageWithFallback";
import QuantityStepper from "./QuantityStepper";
import ProductCard from "./ProductCard";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const savings = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#shop"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease }}
            className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand-100 shadow-soft lg:sticky lg:top-28 lg:self-start"
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              fallbackClassName={product.accent}
              fallbackLabel={product.name}
            />
            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur">
                {product.badge}
              </span>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            className="flex flex-col"
          >
            {[
              <p key="sub" className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-gold">
                {product.subtitle}
              </p>,
              <h1 key="name" className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
                {product.name}
              </h1>,
              <div key="rating" className="mt-4 flex items-center gap-3 text-sm text-muted">
                <div className="flex text-rose-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span>4.9 (128 reviews)</span>
                <span className="h-1 w-1 rounded-full bg-sand-400" />
                <span>{product.size}</span>
              </div>,
              <div key="price" className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-ink">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-muted line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="rounded-full bg-rose-soft px-3 py-1 text-xs font-semibold text-rose-gold-dark">
                      Save {savings}%
                    </span>
                  </>
                )}
              </div>,
              <p key="desc" className="mt-6 leading-relaxed text-muted">
                {product.description}
              </p>,
              <ul key="benefits" className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-soft text-rose-gold">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>,
              <div key="actions" className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <button
                  onClick={() => {
                    addItem(product.slug, quantity);
                    openCart();
                  }}
                  className="flex-1 rounded-full border border-ink py-4 text-sm font-medium tracking-wide text-ink transition hover:bg-ink hover:text-white"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => {
                    addItem(product.slug, quantity);
                    router.push("/checkout");
                  }}
                  className="flex-1 rounded-full bg-ink py-4 text-sm font-medium tracking-wide text-white shadow-lift transition hover:bg-rose-gold"
                >
                  Buy Now
                </button>
              </div>,
              <div key="trust" className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-4 text-center text-xs text-muted">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="h-5 w-5 text-rose-gold" strokeWidth={1.6} />
                  2-4 day delivery
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Banknote className="h-5 w-5 text-rose-gold" strokeWidth={1.6} />
                  Cash on delivery
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-gold" strokeWidth={1.6} />
                  100% authentic
                </div>
              </div>,
              <div key="ingredients" className="mt-8 border-t border-sand-200 pt-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink">
                  Key Ingredients
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-ink"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>,
            ].map((child) => (
              <motion.div
                key={child.key}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <section className="mt-28">
          <h2 className="mb-10 text-center font-serif text-3xl text-ink md:text-4xl">
            Complete Your Ritual
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
