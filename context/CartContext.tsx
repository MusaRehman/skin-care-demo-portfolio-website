"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct, type Product } from "@/lib/products";

type CartLine = { slug: string; quantity: number };
export type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "lumiere-cart";
export const MAX_QUANTITY = 10;
const CartContext = createContext<CartContextValue | null>(null);

const clampQuantity = (q: number) =>
  Math.min(MAX_QUANTITY, Math.max(0, Math.floor(Number.isFinite(q) ? q : 0)));

// Stored data may be stale or hand-edited, so keep only lines for known products.
function parseLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((l) => {
      if (!l || typeof l.slug !== "string" || !getProduct(l.slug)) return [];
      const quantity = clampQuantity(Number(l.quantity));
      return quantity > 0 ? [{ slug: l.slug, quantity }] : [];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      setLines(parseLines(localStorage.getItem(STORAGE_KEY)));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    if (!getProduct(slug)) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug
            ? { ...l, quantity: clampQuantity(l.quantity + quantity) }
            : l
        );
      }
      const q = clampQuantity(quantity);
      return q > 0 ? [...prev, { slug, quantity: q }] : prev;
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    const q = clampQuantity(quantity);
    setLines((prev) =>
      q === 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, quantity: q } : l))
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...product, quantity: l.quantity }] : [];
    });
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      ready,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    };
  }, [lines, ready, isOpen, addItem, updateQuantity, removeItem, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
