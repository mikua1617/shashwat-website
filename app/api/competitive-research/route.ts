import { NextResponse } from "next/server"
import { researchCompany, ResearchError } from "@/lib/competitive-research"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const company = (body as { company?: unknown })?.company
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Missing company." }, { status: 400 })
  }

  try {
    const briefing = await researchCompany(company)
    return NextResponse.json({ briefing })
  } catch (err) {
    if (err instanceof ResearchError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("competitive-research route error:", err)
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 })
  }
}
