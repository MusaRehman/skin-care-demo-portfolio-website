"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Loader2, MapPin, Phone, Truck } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { ORDER_STORAGE_KEY, parseOrder, type Order } from "@/lib/order";

const ease = [0.22, 1, 0.36, 1] as const;

export default function OrderSuccess() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setOrder(parseOrder(sessionStorage.getItem(ORDER_STORAGE_KEY)));
    } catch {}
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-rose-gold" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="font-serif text-3xl">No recent order found</h1>
        <Link
          href="/#shop"
          className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-white transition hover:bg-rose-gold"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const placed = new Date(order.placedAt);
  const eta = new Date(placed.getTime() + 4 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="relative overflow-hidden px-5 pb-24 pt-12 md:px-8 md:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-soft/70 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-ink shadow-lift"
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-rose-gold"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none">
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="white"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-rose-gold">
              Order Confirmed
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Thank you{order.customer.fullName.trim() ? `, ${order.customer.fullName.trim().split(/\s+/)[0]}` : ""}!
            </h1>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Your order has been placed successfully. Our team will call you
              shortly to confirm the delivery.
            </p>
            <p className="mt-5 inline-block rounded-full border border-sand-300 bg-white px-5 py-2 text-sm">
              Order ID <span className="ml-1 font-semibold text-ink">#{order.id}</span>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-12 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft md:p-8"
        >
          <div className="grid gap-5 border-b border-sand-200 pb-6 text-sm sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <div>
                <p className="text-xs text-muted">Estimated delivery</p>
                <p className="font-medium text-ink">{fmt(eta)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <div>
                <p className="text-xs text-muted">Payment</p>
                <p className="font-medium text-ink">Cash on Delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
              <div>
                <p className="text-xs text-muted">Contact</p>
                <p className="font-medium text-ink">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 border-b border-sand-200 py-6 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
            <div>
              <p className="text-xs text-muted">Delivering to</p>
              <p className="font-medium text-ink">{order.customer.fullName}</p>
              <p className="text-muted">
                {[order.customer.address, order.customer.city].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>

          <ul className="space-y-3 py-6 text-sm">
            {order.items.map((item, i) => (
              <li key={`${item.slug}-${i}`} className="flex justify-between gap-4">
                <span className="text-ink">
                  {item.name}
                  <span className="text-muted"> &times; {item.quantity}</span>
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-sand-200 pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <span className="font-medium text-ink">Amount due on delivery</span>
              <span className="text-2xl font-semibold text-ink">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <Link
            href="/"
            className="inline-block rounded-full bg-ink px-10 py-4 text-sm font-medium tracking-wide text-white shadow-lift transition hover:bg-rose-gold"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
