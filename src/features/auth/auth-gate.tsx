"use client";

import { useEffect, useState } from "react";
import { useBarkleyStore } from "@/store/use-store";
import { HomePage } from "@/features/home/home-page";
import { SignInView } from "@/features/auth/sign-in-view";

export function AuthGate() {
  // Mounted guard: isLoggedIn lives in localStorage via Zustand persist.
  // SSR always sees isLoggedIn=false; without this guard React 18 would
  // hydration-mismatch the root route and potentially blank the page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = useBarkleyStore((s) => s.isLoggedIn);

  if (!mounted) {
    return (
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-barkley-cream via-barkley-mist/40 to-barkley-sand/60">
        <div className="h-8 w-64 animate-pulse rounded-2xl bg-barkley-sand/40" />
      </div>
    );
  }

  if (!isLoggedIn) return <SignInView />;

  return <HomePage />;
}
