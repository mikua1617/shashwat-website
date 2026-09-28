import { cookies, headers } from "next/headers"
import { createHmac } from "crypto"

// Best-effort abuse guardrail for the two paid-API demos (personalizer,
// competitive agent). Two independent layers, neither airtight alone on
// serverless - but together they stop casual "keep clicking the button"
// use without needing a database:
//
// 1. A signed cookie on the visitor's browser - the primary limit, and the
//    one that actually persists (survives cold starts). Lightly signed so
//    editing the raw cookie value in devtools doesn't just reset it.
// 2. An in-memory per-IP counter - a secondary net against someone clearing
//    cookies and reloading. Only lives as long as the serverless function
//    instance stays warm, so it's not a hard guarantee, just extra
//    friction. Deliberately set looser than the cookie limit so it won't
//    falsely block multiple real visitors sharing an office/NAT IP.

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

const ipHits = new Map<string, { count: number; firstSeen: number }>()
const IP_WINDOW_MS = 24 * 60 * 60 * 1000

function checkIpLimit(ip: string, scope: string, limit: number): boolean {
  const key = `${scope}:${ip}`
  const now = Date.now()
  const entry = ipHits.get(key)
  if (!entry || now - entry.firstSeen > IP_WINDOW_MS) {
    ipHits.set(key, { count: 1, firstSeen: now })
    return true
  }
  if (entry.count >= limit) return false
  entry.count += 1
  return true
}

export type LimitResult = { allowed: true } | { allowed: false; reason: string }

/**
 * Call at the top of a route handler. Consumes one use if allowed. `scope`
 * namespaces the cookie/IP counters per demo (e.g. "personalize").
 */
export async function checkAndConsumeLimit(
  scope: string,
  cookieLimit: number,
  ipLimit: number
): Promise<LimitResult> {
  const cookieName = `demo_${scope}`
  const cookieStore = await cookies()
  const state = decodeCookie(cookieStore.get(cookieName)?.value) ?? { count: 0 }

  if (state.count >= cookieLimit) {
    return {
      allowed: false,
      reason: `This demo is capped at ${cookieLimit} run${cookieLimit === 1 ? "" : "s"} per visitor to keep API costs sane - thanks for trying it though.`,
    }
  }

  const hdrs = await headers()
  const forwardedFor = hdrs.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown"
  if (!checkIpLimit(ip, scope, ipLimit)) {
    return {
      allowed: false,
      reason: "Too many requests from this network right now. Try again later.",
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
