import { NextRequest, NextResponse } from "next/server";

// Auth is Zustand/localStorage-based (no NextAuth backend yet).
// We mirror isLoggedIn into a lightweight "barkley-auth" cookie so the
// middleware can check it server-side — localStorage is unavailable here.
// TODO: Replace cookie check with getToken() from next-auth/jwt once
//       AUTH_SECRET and a real provider are configured.

const PUBLIC_ROUTES = ["/login", "/register"];

// Paths the middleware must never touch
function isStaticOrInternal(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    // static file extensions
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js|map)$/.test(pathname)
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isStaticOrInternal(pathname)) return NextResponse.next();

  const isAuthed = req.cookies.get("barkley-auth")?.value === "1";

  // Public routes — let them through (or redirect logged-in users away from /login)
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isAuthed && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Everything else requires auth — redirect to /login if missing
  if (!isAuthed) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route; the function above decides what to skip
  matcher: ["/((?!_next/static|_next/image).*)"],
};
