import { Banknote, Leaf, ShieldCheck, Truck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const items = [
  { icon: Truck, title: "Free Delivery", text: "On orders above Rs. 5,000" },
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Dermatologist Tested", text: "Safe for sensitive skin" },
  { icon: Leaf, title: "Clean Formulas", text: "Cruelty free and vegan" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-sand-200 bg-sand-50 px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }, i) => (
          <AnimatedSection
            key={title}
            delay={i * 0.1}
            y={20}
            className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-soft text-rose-gold">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
