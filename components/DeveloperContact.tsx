"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeXml, Headset, Mail, MessageCircle, Phone, X } from "lucide-react";

const developer = {
  name: "Musa Rehman",
  email: "workforrehman@gmail.com",
  phone: "0300 4430309",
  phoneIntl: "923004430309",
};

export default function DeveloperContact() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    {
      href: `tel:+${developer.phoneIntl}`,
      icon: Phone,
      label: "Call",
      value: developer.phone,
    },
    {
      href: `https://wa.me/${developer.phoneIntl}`,
      icon: MessageCircle,
      label: "WhatsApp",
      value: developer.phone,
      external: true,
    },
    {
      href: `mailto:${developer.email}`,
      icon: Mail,
      label: "Email",
      value: developer.email,
    },
  ];

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-40 flex flex-col items-end md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="mb-4 w-[calc(100vw-2.5rem)] max-w-xs overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-lift"
            role="dialog"
            aria-label="Developer contact"
          >
            <div className="relative bg-ink px-5 pb-5 pt-5 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-gold/30 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-rose-gold">
                  <CodeXml className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Website developed by
                  </p>
                  <p className="font-serif text-xl">{developer.name}</p>
                </div>
              </div>
              <p className="relative mt-3 text-xs leading-relaxed text-white/70">
                Want a website like this for your business? Get in touch.
              </p>
            </div>
            <ul className="p-2">
              {links.map(({ href, icon: Icon, label, value, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-sand-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-soft text-rose-gold transition group-hover:bg-rose-gold group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-muted">{label}</span>
                      <span className="block truncate text-sm font-medium text-ink">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close developer contact" : "Contact the developer"}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lift"
      >
        {!open && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-rose-gold/40 [animation-duration:2.4s]" />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
