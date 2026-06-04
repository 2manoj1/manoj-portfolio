import { NextRequest } from "next/server";

// In-memory sliding window request tracker
const tracker = new Map<string, { count: number; reset: number }>();
const LIMIT = 15; // 15 requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

export function checkRateLimit(req: NextRequest): { allowed: boolean; retryAfter?: number } {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "anonymous";
  const now = Date.now();

  const record = tracker.get(ip);

  if (!record) {
    tracker.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now > record.reset) {
    tracker.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { allowed: true };
  }

  record.count += 1;
  if (record.count > LIMIT) {
    const retryAfter = Math.ceil((record.reset - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}
