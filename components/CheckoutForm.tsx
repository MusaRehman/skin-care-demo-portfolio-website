"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  formatPrice,
} from "@/lib/products";
import {
  CITIES,
  ORDER_STORAGE_KEY,
  generateOrderId,
  type Order,
  type OrderCustomer,
} from "@/lib/order";
import ImageWithFallback from "./ImageWithFallback";
import QuantityStepper from "./QuantityStepper";

const ease = [0.22, 1, 0.36, 1] as const;

const empty: OrderCustomer = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

type Errors = Partial<Record<keyof OrderCustomer, string>>;

function ErrorText({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 text-xs text-rose-gold-dark"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ink"
    >
      {children}
      {optional && (
        <span className="ml-1 font-normal normal-case tracking-normal text-muted">
          (optional)
        </span>
      )}
    </label>
  );
}

function validate(values: OrderCustomer): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Please enter your full name";
  const phone = values.phone.replace(/[\s-]/g, "");
  if (!/^(\+92|0)3\d{9}$/.test(phone))
    errors.phone = "Enter a valid mobile number, e.g. 0300 1234567";
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address";
  if (!values.city) errors.city = "Please select your city";
  if (values.address.trim().length < 10)
    errors.address = "Please enter your complete address";
  return errors;
}

export default function CheckoutForm() {
  const { items, subtotal, ready, updateQuantity, clear } = useCart();
  const router = useRouter();
  const [values, setValues] = useState<OrderCustomer>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof OrderCustomer, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const set = (field: keyof OrderCustomer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field: keyof OrderCustomer) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    const errs = validate(values);
    setErrors(errs);
    setTouched({ fullName: true, phone: true, email: true, city: true, address: true });
    if (Object.keys(errs).length) {
      document.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600));
    const order: Order = {
      id: generateOrderId(),
      placedAt: new Date().toISOString(),
      customer: {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        city: values.city,
        address: values.address.trim(),
        notes: values.notes.trim(),
      },
      items: items.map(({ slug, name, size, price, quantity }) => ({
        slug,
        name,
        size,
        price,
        quantity,
      })),
      subtotal,
      delivery,
      total,
    };
    try {
      sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {}
    setPlaced(true);
    clear();
    router.push("/order-success");
  };

  if (!ready || placed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-rose-gold" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center"
      >
        <div className="rounded-full bg-sand-100 p-6">
          <ShoppingBag className="h-10 w-10 text-sand-400" strokeWidth={1.4} />
        </div>
        <h1 className="font-serif text-3xl">Your bag is empty</h1>
        <p className="text-muted">Add a product to continue to checkout.</p>
        <Link
          href="/#shop"
          className="mt-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-white transition hover:bg-rose-gold"
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  const field = (name: keyof OrderCustomer) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-ink sm:text-sm outline-none transition placeholder:text-muted/60 focus:ring-4 ${
      touched[name] && errors[name]
        ? "border-rose-gold focus:ring-rose-soft"
        : "border-sand-300 focus:border-ink/40 focus:ring-sand-100"
    }`;

  const errorFor = (name: keyof OrderCustomer) =>
    touched[name] ? errors[name] : undefined;

  return (
    <div className="px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#shop"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Continue shopping
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 font-serif text-4xl text-ink md:text-5xl"
        >
          Checkout
        </motion.h1>

        <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="space-y-8"
          >
            <section className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-soft md:p-8">
              <h2 className="mb-6 font-serif text-2xl">Delivery Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <input id="fullName" name="fullName" autoComplete="name" placeholder="Ayesha Khan" value={values.fullName} onChange={set("fullName")} onBlur={blur("fullName")} className={field("fullName")} />
                  <ErrorText message={errorFor("fullName")} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0300 1234567" value={values.phone} onChange={set("phone")} onBlur={blur("phone")} className={field("phone")} />
                  <ErrorText message={errorFor("phone")} />
                </div>
                <div>
                  <Label htmlFor="email" optional>Email</Label>
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set("email")} onBlur={blur("email")} className={field("email")} />
                  <ErrorText message={errorFor("email")} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="city">City</Label>
                  <select id="city" name="city" value={values.city} onChange={set("city")} onBlur={blur("city")} className={`${field("city")} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236f6a64%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10 ${values.city ? "" : "text-muted/60"}`}>
                    <option value="" disabled>Select your city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c} className="text-ink">{c}</option>
                    ))}
                  </select>
                  <ErrorText message={errorFor("city")} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <textarea id="address" name="address" rows={3} autoComplete="street-address" placeholder="House #, street, area, landmark" value={values.address} onChange={set("address")} onBlur={blur("address")} className={`${field("address")} resize-none`} />
                  <ErrorText message={errorFor("address")} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes" optional>Order Notes</Label>
                  <textarea id="notes" name="notes" rows={2} placeholder="Any special instructions for delivery" value={values.notes} onChange={set("notes")} className={`${field("notes")} resize-none`} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-soft md:p-8">
              <h2 className="mb-6 font-serif text-2xl">Payment Method</h2>
              <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-sand-50 p-5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink" />
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-soft text-rose-gold">
                  <Banknote className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-medium text-ink">Cash on Delivery</p>
                  <p className="text-xs text-muted">Pay in cash when your order arrives at your door.</p>
                </div>
              </div>
            </section>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft md:p-8">
              <h2 className="mb-6 font-serif text-2xl">Order Summary</h2>
              <ul className="space-y-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li key={item.slug} layout exit={{ opacity: 0, height: 0 }} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand-100">
                        <ImageWithFallback src={item.image} alt={item.name} fill sizes="80px" className="object-cover" fallbackClassName={item.accent} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium leading-snug text-ink">{item.name}</p>
                            <p className="text-xs text-muted">{item.size}</p>
                          </div>
                          <p className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <QuantityStepper size="sm" min={0} value={item.quantity} onChange={(q) => updateQuantity(item.slug, q)} />
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-6 space-y-3 border-t border-sand-200 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery</span>
                  <span className="text-ink">{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
                </div>
                {delivery > 0 && (
                  <p className="rounded-xl bg-rose-soft/60 px-3 py-2 text-xs text-rose-gold-dark">
                    Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
                  </p>
                )}
                <div className="flex items-baseline justify-between border-t border-sand-200 pt-4">
                  <span className="font-medium text-ink">Total</span>
                  <span className="text-2xl font-semibold text-ink">{formatPrice(total)}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium tracking-wide text-white shadow-lift transition hover:bg-rose-gold disabled:cursor-wait disabled:opacity-80"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Placing your order...
                  </>
                ) : (
                  <>Place Order &middot; {formatPrice(total)}</>
                )}
              </motion.button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <Lock className="h-3.5 w-3.5" /> Your details are safe with us
              </p>
            </div>
          </motion.aside>
        </form>
      </div>
    </div>
  );
}
