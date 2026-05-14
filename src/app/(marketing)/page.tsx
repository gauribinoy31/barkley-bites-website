import type { Metadata } from "next";
import { AuthGate } from "@/features/auth/auth-gate";

export const metadata: Metadata = {
  title: "Premium dog treats & wellness",
  description:
    "Barkley Bites is a luxury direct-to-consumer pet brand with cinematic shopping, subscriptions, and obsessively sourced nutrition.",
};

export default function MarketingHome() {
  // AuthGate checks isLoggedIn (Zustand/localStorage):
  //   • not logged in  → shows <SignInView />
  //   • logged in      → shows <HomePage />
  return <AuthGate />;
}
