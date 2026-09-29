import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const localBuckets = new Map();
const limiters = new Map();

function clientKey(request, action) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${action}:${forwardedFor || "local"}`;
}

function getSharedLimiter(action, limit, windowMs) {
  const cacheKey = `${action}:${limit}:${windowMs}`;
  if (!limiters.has(cacheKey)) {
    const redis = Redis.fromEnv();
    limiters.set(cacheKey, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "redline:rate-limit",
    }));
  }
  return limiters.get(cacheKey);
}

export async function checkRateLimit(request, action, limit, windowMs) {
  const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const identifier = clientKey(request, action);

  if (hasRedis) {
    const result = await getSharedLimiter(action, limit, windowMs).limit(identifier);
    return { allowed: result.success, retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
  }

  if (process.env.NODE_ENV === "production") return { allowed: false, unavailable: true };

  const now = Date.now();
  const bucket = localBuckets.get(identifier);
  if (!bucket || bucket.resetAt <= now) {
    localBuckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { allowed: true };
}