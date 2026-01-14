// middleware.ts  (Edge Runtime)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// reads UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN from env
const redis = Redis.fromEnv();

// create a 10‑requests-per-60‑seconds sliding-window limiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "60 s"),
});

// middleware.ts  (Edge Runtime)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip rate limiting for development to avoid Redis connection issues
  // TODO: Re-enable with proper Redis configuration for production
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
    // Dynamically import Redis to avoid edge runtime issues
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit } = await import("@upstash/ratelimit");

    const redis = Redis.fromEnv();
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "60 s"),
    });

    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", String(limit));
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  } catch (error) {
    console.warn("Rate limiting disabled due to Redis connection error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
