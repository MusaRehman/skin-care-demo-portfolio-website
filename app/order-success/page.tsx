import type { Metadata } from "next";
import OrderSuccess from "@/components/OrderSuccess";
import { brand } from "@/lib/products";

export const metadata: Metadata = { title: `Order Confirmed | ${brand.name}` };

export default function OrderSuccessPage() {
  return <OrderSuccess />;
}
