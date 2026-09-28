import { NextResponse } from "next/server"
import { researchCompany, ResearchError } from "@/lib/competitive-research"
import { checkAndConsumeLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const maxDuration = 60

// IP_LIMIT is the real, Redis-backed cap; COOKIE_LIMIT is a same-value
// secondary check (see lib/rate-limit.ts).
const COOKIE_LIMIT = 2
const IP_LIMIT = 2

export async function POST(req: Request) {
  const limit = await checkAndConsumeLimit("competitive-research", COOKIE_LIMIT, IP_LIMIT)
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const url = (body as { url?: unknown })?.url
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Missing company URL." }, { status: 400 })
  }

  try {
    const briefing = await researchCompany(url)
    return NextResponse.json({ briefing })
  } catch (err) {
    if (err instanceof ResearchError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("competitive-research route error:", err)
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 })
  }
}
