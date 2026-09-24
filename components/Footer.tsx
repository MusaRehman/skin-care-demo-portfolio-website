import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, products } from "@/lib/products";

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink px-5 pt-16 text-white/70 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 pb-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl text-white">
            Lumière<span className="text-rose-gold">.</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {brand.description}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Shop
          </p>
          <ul className="space-y-2.5 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="transition hover:text-white"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Contact
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-rose-gold" /> {brand.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-rose-gold" /> {brand.email}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-rose-gold" /> Lahore, Pakistan
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-center text-xs md:flex-row md:text-left">
        <p>
          &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
        <p>
          Designed &amp; developed by{" "}
          <span className="text-white">Musa Rehman</span>
          <span className="mx-2 text-white/30">|</span>
          <a
            href="mailto:workforrehman@gmail.com"
            className="text-rose-gold transition hover:text-white"
          >
            workforrehman@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
