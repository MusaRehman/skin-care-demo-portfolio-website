import { products } from "@/lib/products";
import AnimatedSection from "./AnimatedSection";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section id="shop" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-gold">
            The Essentials
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            Shop the Collection
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Four thoughtfully formulated steps. Everything your skin needs,
            nothing it doesn&apos;t.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
