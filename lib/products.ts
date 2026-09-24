export const brand = {
  name: "Lumière Skin",
  tagline: "Pure care, visibly radiant.",
  description:
    "Clean, dermatologist-tested skincare crafted with botanical actives for healthy, luminous skin every day.",
  logo: "/images/logo.png",
  banner: "/images/banner.png",
  phone: "+92 300 0000000",
  email: "hello@lumiereskin.pk",
};

export const DELIVERY_FEE = 250;
export const FREE_DELIVERY_THRESHOLD = 5000;

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  image: string;
  accent: string;
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "vitamin-c-glow-serum",
    name: "Vitamin C Glow Serum",
    subtitle: "Brightening Serum",
    price: 3499,
    compareAtPrice: 4299,
    size: "30 ml",
    shortDescription: "15% Vitamin C for a brighter, even-toned complexion.",
    description:
      "A lightweight, fast-absorbing serum powered by 15% stabilised Vitamin C, Ferulic Acid and Vitamin E. It visibly fades dark spots, evens skin tone and defends against daily environmental stress, leaving skin radiant and refreshed.",
    benefits: [
      "Visibly brightens dull skin",
      "Fades dark spots and pigmentation",
      "Antioxidant protection",
      "Suitable for all skin types",
    ],
    ingredients: ["15% Vitamin C", "Ferulic Acid", "Vitamin E", "Hyaluronic Acid"],
    image: "/images/product-1.png",
    accent: "from-amber-100 to-orange-50",
    badge: "Bestseller",
  },
  {
    slug: "hydra-cloud-moisturizer",
    name: "Hydra Cloud Moisturizer",
    subtitle: "Daily Moisturizer",
    price: 2899,
    size: "50 ml",
    shortDescription: "Weightless gel-cream with 72-hour hydration.",
    description:
      "A whipped gel-cream that melts into skin to deliver deep, long-lasting hydration without heaviness. Ceramides and Squalane restore the skin barrier while Niacinamide refines texture for a soft, plump finish.",
    benefits: [
      "72-hour lasting hydration",
      "Strengthens skin barrier",
      "Non-greasy, non-comedogenic",
      "Soothes and softens",
    ],
    ingredients: ["Ceramide Complex", "Squalane", "Niacinamide", "Aloe Vera"],
    image: "/images/product-2.png",
    accent: "from-sky-100 to-blue-50",
    badge: "New",
  },
  {
    slug: "gentle-foam-cleanser",
    name: "Gentle Foam Cleanser",
    subtitle: "pH-Balanced Cleanser",
    price: 1999,
    size: "150 ml",
    shortDescription: "Soft foaming cleanse that never strips the skin.",
    description:
      "A cushiony, low-pH foam that lifts away makeup, oil and impurities while keeping the skin's natural moisture intact. Infused with Green Tea and Chamomile to calm and comfort even sensitive skin.",
    benefits: [
      "Removes makeup and impurities",
      "Maintains natural moisture",
      "Calms sensitive skin",
      "Fragrance free",
    ],
    ingredients: ["Green Tea Extract", "Chamomile", "Glycerin", "Panthenol"],
    image: "/images/product-3.png",
    accent: "from-emerald-100 to-green-50",
  },
  {
    slug: "invisible-shield-spf-50",
    name: "Invisible Shield SPF 50",
    subtitle: "Daily Sunscreen",
    price: 2499,
    compareAtPrice: 2999,
    size: "50 ml",
    shortDescription: "Broad-spectrum protection with a sheer, no white-cast finish.",
    description:
      "An ultra-light, invisible sunscreen offering broad-spectrum SPF 50 PA++++ protection. It doubles as a hydrating primer, sits beautifully under makeup and leaves zero white cast on every skin tone.",
    benefits: [
      "Broad-spectrum SPF 50 PA++++",
      "No white cast",
      "Doubles as a makeup primer",
      "Water and sweat resistant",
    ],
    ingredients: ["Zinc Oxide", "Centella Asiatica", "Vitamin B5", "Hyaluronic Acid"],
    image: "/images/product-4.png",
    accent: "from-rose-100 to-pink-50",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(amount: number) {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `Rs. ${String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
