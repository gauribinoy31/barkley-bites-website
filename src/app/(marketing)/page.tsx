import type { Metadata } from "next";
import { HomePage } from "@/features/home/home-page";

export const metadata: Metadata = {
  title: "Premium dog treats & wellness",
  description:
    "Barkley Bites is a luxury direct-to-consumer pet brand with cinematic shopping, subscriptions, and obsessively sourced nutrition.",
};

export default function MarketingHome() {
  return <HomePage />;
}
