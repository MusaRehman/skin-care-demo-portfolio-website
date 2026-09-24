"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/products";
import ImageWithFallback from "./ImageWithFallback";

const ease = [0.22, 1, 0.36, 1] as const;

// JS scroll handlers lag behind iOS momentum scrolling; CSS scroll-driven
// animations (see .hero-parallax-* in globals.css) run on the compositor.
function useJsParallaxFallback() {
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    setFallback(!CSS.supports("animation-timeline: view()"));
  }, []);
  return fallback;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const jsParallax = useJsParallaxFallback();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="grain hero-timeline relative flex h-[calc(100svh-4rem)] min-h-[560px] items-center overflow-hidden md:h-[calc(100svh-5rem)]"
    >
      <motion.div
        className="hero-parallax-image absolute inset-0 will-change-transform"
        style={{ y: jsParallax ? imageY : 0 }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 2.4, ease }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-soft via-sand-100 to-sand-200">
          <div className="hero-blob-a absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-rose-gold/20 blur-3xl" />
          <div className="hero-blob-b absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-sand-300/50 blur-3xl" />
        </div>
        <ImageWithFallback
          src={brand.banner}
          alt="Lumière Skin banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          fallbackClassName="from-transparent to-transparent"
          hideFallbackIcon
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent md:hidden" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,rgb(250_248_245/0.9)_0%,rgb(250_248_245/0.55)_45%,transparent_75%)] md:block" />

      <motion.div
        style={jsParallax ? { y: contentY, opacity } : { y: 0, opacity: 1 }}
        className="hero-parallax-content relative mx-auto w-full max-w-7xl px-5 md:px-8"
      >
        <div className="max-w-xl md:mx-auto md:max-w-3xl md:text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-gold"
          >
            <span className="h-px w-10 bg-rose-gold" />
            New Collection 2026
            <span className="hidden h-px w-10 bg-rose-gold md:block" />
          </motion.p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {["Skin that", "glows from", "within."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 2 ? "italic text-rose-gold" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted md:mx-auto md:max-w-lg md:text-lg"
          >
            Clinically proven, botanically powered skincare. Four essentials
            for a simple ritual and visibly healthier skin.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="mt-10 flex flex-wrap items-center gap-4 md:justify-center"
          >
            <a
              href="#shop"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-white shadow-lift transition-all duration-300 hover:bg-rose-gold"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center rounded-full border border-ink/15 bg-white/50 px-8 py-4 text-sm font-medium tracking-wide text-ink backdrop-blur transition hover:border-ink/40"
            >
              Our Story
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-ink/15 bg-white/40 p-3 text-ink backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.4 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  );
}
