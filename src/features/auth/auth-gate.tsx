"use client";

import { useEffect, useState } from "react";
import { useBarkleyStore } from "@/store/use-store";
import { HomePage } from "@/features/home/home-page";

export function AuthGate() {
  // Middleware already blocked unauthenticated requests before this renders.
  // This mounted guard just prevents a hydration mismatch between SSR (which
  // can't read localStorage) and the first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = useBarkleyStore((s) => s.isLoggedIn);

  if (!mounted || !isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-barkley-cream via-barkley-mist/40 to-barkley-sand/60">
        <div className="h-8 w-48 animate-pulse rounded-2xl bg-barkley-sand/40" />
      </div>
    );
  }

  return <HomePage />;
}
