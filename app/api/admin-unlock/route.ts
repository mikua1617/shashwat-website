import { NextResponse } from "next/server"
import { ADMIN_BYPASS_COOKIE, adminBypassCookieValue } from "@/lib/rate-limit"

export const runtime = "nodejs"

// Visit /api/admin-unlock?token=<ADMIN_BYPASS_TOKEN> once from your own
// browser to bypass the demo rate limits from then on. The token lives
// only in Vercel's env vars (never sent to the client), so this can't be
// discovered from the page source the way a client-embedded secret could.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const expected = process.env.ADMIN_BYPASS_TOKEN

  if (!expected) {
    return new NextResponse("Admin bypass isn't configured (missing ADMIN_BYPASS_TOKEN).", {
      status: 500,
    })
  }

  if (!token || token !== expected) {
    return new NextResponse("Not authorized.", { status: 403 })
  }

  const res = new NextResponse("Unlocked - demo rate limits are bypassed on this browser now.")
  res.cookies.set(ADMIN_BYPASS_COOKIE, adminBypassCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  return res
}
