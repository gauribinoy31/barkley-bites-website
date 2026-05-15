"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useBarkleyStore, selectCartItemCount } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/subscriptions", label: "Subscription" },
  { href: "/faq", label: "FAQ" },
];

type NavbarClientProps = {
  session: Session | null;
};

export function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const cartCount = useBarkleyStore(selectCartItemCount);
  const isLoggedIn = useBarkleyStore((s) => s.isLoggedIn);
  const clearUserData = useBarkleyStore((s) => s.clearUserData);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleZustandSignOut = () => {
    // Clears profileData, cart, wishlist and isLoggedIn so the next user starts fresh.
    // TODO: Also call NextAuth signOut() once backend is wired
    clearUserData();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-barkley-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-barkley-forest text-xs font-semibold text-barkley-cream shadow-soft">
            BB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm tracking-[0.18em] text-barkley-cocoa">Barkley Bites</span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.26em] text-muted-foreground">
              Pet wellness atelier
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-barkley-forest",
                pathname === link.href && "text-barkley-forest",
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* My Profile — visible only when isLoggedIn (Zustand) */}
          {isLoggedIn && (
            <Link
              href="/profile"
              className={cn(
                "transition-colors hover:text-barkley-forest",
                pathname === "/profile" && "text-barkley-forest",
              )}
            >
              My Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-barkley-cocoa shadow-soft transition hover:-translate-y-0.5 hover:shadow-premium">
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-barkley-forest px-1 text-[0.6rem] font-semibold text-barkley-cream">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </Link>

          {session?.user || isLoggedIn ? (
            <button
              type="button"
              onClick={session?.user ? () => signOut({ callbackUrl: "/" }) : handleZustandSignOut}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-barkley-cocoa shadow-soft transition hover:-translate-y-0.5 hover:shadow-premium md:inline-flex"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/" className="hidden md:inline-flex">
              <Button variant="outline" size="sm" className="rounded-full px-5 text-[0.65rem] uppercase tracking-[0.18em]">
                Sign in
              </Button>
            </Link>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-barkley-cocoa shadow-soft md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/40 bg-barkley-cream/95 px-4 pb-4 pt-2 md:hidden"
          >
            <div className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="py-1">
                  {link.label}
                </Link>
              ))}
              {/* My Profile — visible only when isLoggedIn (Zustand) */}
              {isLoggedIn && (
                <Link href="/profile" className="py-1">
                  My Profile
                </Link>
              )}
              <Link href="/cart" className="py-1">
                Cart{cartCount ? ` (${cartCount})` : ""}
              </Link>
              {session?.user || isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="py-1 text-left"
                    onClick={session?.user ? () => signOut({ callbackUrl: "/" }) : handleZustandSignOut}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/" className="py-1">
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
