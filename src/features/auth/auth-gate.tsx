"use client";

import { useEffect, useState } from "react";
import { useBarkleyStore } from "@/store/use-store";
import { HomePage } from "@/features/home/home-page";
import { SignInView } from "@/features/auth/sign-in-view";

export function AuthGate() {
  // isLoggedIn lives in localStorage (Zustand persist) — unavailable on the server.
  // We default to showing <SignInView /> before hydration so unauthenticated users
  // see the gate immediately with no skeleton flash. Authenticated users will see
  // one imperceptible frame of SignInView before swapping to <HomePage />.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = useBarkleyStore((s) => s.isLoggedIn);

  if (!mounted || !isLoggedIn) return <SignInView />;

  return <HomePage />;
}
