"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import ImageWithFallback from "./ImageWithFallback";
import QuantityStepper from "./QuantityStepper";

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, updateQuantity, removeItem } =
    useCart();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-sand-200 px-6 py-5">
              <h2 className="font-serif text-2xl">Your Bag</h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 transition hover:bg-sand-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="rounded-full bg-sand-100 p-5">
                  <ShoppingBag className="h-8 w-8 text-sand-400" strokeWidth={1.4} />
                </div>
                <p className="font-serif text-xl">Your bag is empty</p>
                <p className="text-sm text-muted">
                  Discover our essentials for radiant skin.
                </p>
                <Link
                  href="/#shop"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-white transition hover:bg-rose-gold"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand-100">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                            fallbackClassName={item.accent}
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium leading-snug">{item.name}</p>
                              <p className="text-xs text-muted">{item.size}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.slug)}
                              aria-label={`Remove ${item.name}`}
                              className="rounded-full p-1.5 text-muted transition hover:bg-sand-100 hover:text-rose-gold"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              value={item.quantity}
                              onChange={(q) => updateQuantity(item.slug, q)}
                            />
                            <span className="text-sm font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-sand-200 px-6 py-6">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-5 text-xs text-muted">
                    Delivery calculated at checkout. Pay cash on delivery.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full rounded-full bg-ink py-4 text-center text-sm font-medium tracking-wide text-white transition hover:bg-rose-gold"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
