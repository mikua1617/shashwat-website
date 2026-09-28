import { cookies, headers } from "next/headers"
import { createHmac } from "crypto"
import { redis } from "./redis"

// Rate limiting for the two paid-API demos (personalizer, competitive
// agent), in two layers:
//
// 1. Redis, keyed by IP - the real, persistent backstop. Vercel functions
//    don't share memory between invocations or cold starts, so this is
//    the only layer that can't be reset just by reloading the page or
//    clearing cookies. Reads the env vars Vercel's own "Upstash for
//    Redis" storage integration provisions (KV_REST_API_URL/TOKEN) -
//    note these are NOT the UPSTASH_REDIS_REST_URL/TOKEN names Upstash's
//    own docs show for a standalone account; Vercel's one-click
//    integration uses the KV_ prefix instead. If neither is set, this
//    layer is skipped (see checkAndConsumeLimit) rather than breaking
//    the demo - so it degrades gracefully, but isn't real protection
//    until the vars exist.
// 2. A signed cookie - a cheap secondary check on top, mainly so a normal
//    visitor sees "you've used this" state without needing a round trip.
//    On its own this is not the security boundary; Redis is.

const REDIS_WINDOW_SECONDS = 60 * 60 * 24 * 30 // 30 days

async function checkRedisLimit(
  ip: string,
  scope: string,
  limit: number
): Promise<{ allowed: boolean; skipped: boolean }> {
  if (!redis) return { allowed: true, skipped: true }
  const key = `ratelimit:${scope}:${ip}`
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, REDIS_WINDOW_SECONDS)
  }
  return { allowed: count <= limit, skipped: false }
}

const SECRET = process.env.GROQ_API_KEY ?? "portfolio-demo-fallback-secret"

type CookieState = { count: number }

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 16)
}

function encodeCookie(state: CookieState): string {
  const b64 = Buffer.from(JSON.stringify(state)).toString("base64url")
  return `${b64}.${sign(b64)}`
}

function decodeCookie(value: string | undefined): CookieState | null {
  if (!value) return null
  const [b64, sig] = value.split(".")
  if (!b64 || !sig || sign(b64) !== sig) return null
  try {
    const parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"))
    if (typeof parsed?.count === "number") return parsed as CookieState
    return null
  } catch {
    return null
  }
}

function getClientIp(hdrs: Headers): string {
  const forwardedFor = hdrs.get("x-forwarded-for")
  return forwardedFor?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown"
}

// Admin bypass: visiting /api/admin-unlock?token=<ADMIN_BYPASS_TOKEN> (a
// server-only env var, never shipped to the client) sets this signed
// cookie in the browser that visits it. Anyone with that cookie skips
// rate limiting entirely - it's for testing from your own browser, not a
// client-embedded secret anyone could copy out of the page source.
export const ADMIN_BYPASS_COOKIE = "demo_admin"

export function adminBypassCookieValue(): string {
  return sign("admin-bypass-v1")
}

async function hasAdminBypass(): Promise<boolean> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ADMIN_BYPASS_COOKIE)?.value
  return !!value && value === adminBypassCookieValue()
}

export type LimitResult = { allowed: true } | { allowed: false; reason: string }

/**
 * Call at the top of a route handler. Consumes one use if allowed. `scope`
 * namespaces the cookie/Redis counters per demo (e.g. "personalize").
 */
export async function checkAndConsumeLimit(
  scope: string,
  cookieLimit: number,
  ipLimit: number
): Promise<LimitResult> {
  if (await hasAdminBypass()) return { allowed: true }

  const hdrs = await headers()
  const ip = getClientIp(hdrs)

  // Redis first - it's the real boundary. A cheap in-request short-circuit:
  // if this IP is already over, don't even bother with the cookie dance.
  const redisCheck = await checkRedisLimit(ip, scope, ipLimit)
  if (!redisCheck.skipped && !redisCheck.allowed) {
    return {
      allowed: false,
      reason: `This demo is capped at ${ipLimit} run${ipLimit === 1 ? "" : "s"} per visitor to keep API costs sane - thanks for trying it though.`,
    }
  }

  const cookieName = `demo_${scope}`
  const cookieStore = await cookies()
  const state = decodeCookie(cookieStore.get(cookieName)?.value) ?? { count: 0 }

  if (state.count >= cookieLimit) {
    return {
      allowed: false,
      reason: `This demo is capped at ${cookieLimit} run${cookieLimit === 1 ? "" : "s"} per visitor to keep API costs sane - thanks for trying it though.`,
    }
  }

  const next: CookieState = { count: state.count + 1 }
  cookieStore.set(cookieName, encodeCookie(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })

  return { allowed: true }
}
