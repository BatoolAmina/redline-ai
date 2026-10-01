import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const localBuckets = new Map();
const guestChatBuckets = new Map();
const limiters = new Map();

function clientKey(request, action) {
  const headers = request.headers;
  const header = typeof headers.get === "function"
    ? headers.get("x-forwarded-for")
    : headers["x-forwarded-for"];
  const forwardedFor = String(header || "").split(",")[0].trim();
  return `${action}:${forwardedFor || "local"}`;
}

function envValue(name) {
  return process.env[name]?.trim().replace(/^(["'])(.*)\1$/, "$2");
}

function getSharedLimiter(action, limit, windowMs) {
  const cacheKey = `${action}:${limit}:${windowMs}`;
  if (!limiters.has(cacheKey)) {
    const redis = new Redis({
      url: envValue("UPSTASH_REDIS_REST_URL"),
      token: envValue("UPSTASH_REDIS_REST_TOKEN"),
    });
    limiters.set(cacheKey, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "redline:rate-limit",
    }));
  }
  return limiters.get(cacheKey);
}

export async function checkRateLimit(request, action, limit, windowMs) {
  const hasRedis = Boolean(envValue("UPSTASH_REDIS_REST_URL") && envValue("UPSTASH_REDIS_REST_TOKEN"));
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

export async function checkGuestChatLimit(guestId, limit = 4) {
  const key = `guest-chat:${guestId}`;
  const hasRedis = Boolean(envValue("UPSTASH_REDIS_REST_URL") && envValue("UPSTASH_REDIS_REST_TOKEN"));
  if (hasRedis) {
    const redis = new Redis({ url: envValue("UPSTASH_REDIS_REST_URL"), token: envValue("UPSTASH_REDIS_REST_TOKEN") });
    const count = await redis.incr(`redline:${key}`);
    if (count === 1) await redis.expire(`redline:${key}`, 60 * 60 * 24 * 30);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  }

  if (process.env.NODE_ENV === "production") return { allowed: false, unavailable: true };
  const bucket = guestChatBuckets.get(key) || 0;
  const count = bucket + 1;
  guestChatBuckets.set(key, count);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}