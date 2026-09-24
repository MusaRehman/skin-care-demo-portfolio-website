import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { brand } from "@/lib/products";

export const metadata: Metadata = { title: `Checkout | ${brand.name}` };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
