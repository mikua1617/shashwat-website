import { NextResponse } from "next/server"
import { personalizeForUrl, PersonalizationError, type MessageType } from "@/lib/personalization"

export const runtime = "nodejs"
export const maxDuration = 45

const VALID_TYPES: MessageType[] = ["cold", "connection", "followup"]

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const url = (body as { url?: unknown })?.url
  const type = (body as { type?: unknown })?.type

  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Missing LinkedIn URL." }, { status: 400 })
  }
  if (typeof type !== "string" || !VALID_TYPES.includes(type as MessageType)) {
    return NextResponse.json({ error: "Invalid message type." }, { status: 400 })
  }

  try {
    const draft = await personalizeForUrl(url, type as MessageType)
    return NextResponse.json({ draft })
  } catch (err) {
    if (err instanceof PersonalizationError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("personalize route error:", err)
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 })
  }
}
