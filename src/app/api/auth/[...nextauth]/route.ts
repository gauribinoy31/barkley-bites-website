import type { NextRequest } from "next/server";
import { handlers } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    return await handlers.GET(request);
  } catch {
    // AUTH_SECRET not configured — return an empty session so SessionProvider
    // doesn't log a ClientFetchError in the browser console
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handlers.POST(request);
  } catch {
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }
}
