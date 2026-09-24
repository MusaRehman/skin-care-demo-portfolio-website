import { brand } from "@/lib/products";
import AnimatedSection from "./AnimatedSection";
import Logo from "./Logo";

export default function BrandSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-[30vh] scroll-mt-20 items-center justify-center overflow-hidden border-b border-sand-200 bg-sand-50 px-5 py-20 md:py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-soft/70 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <AnimatedSection className="flex justify-center">
          <Logo size="lg" />
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="mx-auto my-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-sand-300" />
            <span className="h-1.5 w-1.5 rotate-45 bg-rose-gold" />
            <span className="h-px w-12 bg-sand-300" />
          </div>
          <p className="font-serif text-2xl italic text-ink md:text-3xl">
            {brand.tagline}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {brand.description}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
