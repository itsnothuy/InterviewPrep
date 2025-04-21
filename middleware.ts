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
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
