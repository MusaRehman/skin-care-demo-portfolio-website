export type OrderCustomer = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
};

export type Order = {
  id: string;
  placedAt: string;
  customer: OrderCustomer;
  items: { slug: string; name: string; size: string; price: number; quantity: number }[];
  subtotal: number;
  delivery: number;
  total: number;
};

export const ORDER_STORAGE_KEY = "lumiere-last-order";

export const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Gujranwala",
  "Other",
];

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function parseOrder(raw: string | null): Order | null {
  if (!raw) return null;
  try {
    const o: unknown = JSON.parse(raw);
    if (
      !isObject(o) ||
      typeof o.id !== "string" ||
      !isObject(o.customer) ||
      typeof o.customer.fullName !== "string" ||
      !Array.isArray(o.items) ||
      typeof o.total !== "number"
    ) {
      return null;
    }
    const c = o.customer;
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    const placedAt = new Date(str(o.placedAt));
    return {
      id: o.id,
      placedAt: Number.isNaN(placedAt.getTime()) ? new Date().toISOString() : placedAt.toISOString(),
      customer: {
        fullName: c.fullName as string,
        phone: str(c.phone),
        email: str(c.email),
        city: str(c.city),
        address: str(c.address),
        notes: str(c.notes),
      },
      items: o.items.filter(isObject).map((i) => ({
        slug: str(i.slug),
        name: str(i.name),
        size: str(i.size),
        price: num(i.price),
        quantity: num(i.quantity),
      })),
      subtotal: num(o.subtotal),
      delivery: num(o.delivery),
      total: o.total,
    };
  } catch {
    return null;
  }
}

export function generateOrderId() {
  return `LS-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}
