// Server-only helpers for the personalization demo. Real pipeline: Apify
// scrapes the given public LinkedIn profile, then Groq drafts a message
// grounded in what was actually found - no canned templates.

const LINKEDIN_URL_RE = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%.]+\/?$/i
// See note in lib/competitive-research.ts - this org's Groq console only
// allow-lists a specific set of models, and gpt-oss-120b is the largest
// general-purpose one actually on that list.
const GROQ_MODEL = "openai/gpt-oss-120b"
const APIFY_ACTOR = "harvestapi~linkedin-profile-scraper"

export type MessageType = "cold" | "connection" | "followup"

class PersonalizationError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type HarvestApiProfile = {
  firstName?: string
  lastName?: string
  headline?: string
  about?: string
  location?: { linkedinText?: string }
  topSkills?: string[]
  currentPosition?: { position?: string; companyName?: string }
  experience?: { position?: string; companyName?: string }[]
}

export function isValidLinkedInProfileUrl(url: string): boolean {
  return LINKEDIN_URL_RE.test(url.trim())
}

async function scrapeProfile(url: string): Promise<HarvestApiProfile> {
  const token = process.env.APIFY_TOKEN
  if (!token) {
    throw new PersonalizationError(
      "Personalizer isn't configured yet (missing APIFY_TOKEN).",
      500
    )
  }

  const endpoint = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${encodeURIComponent(
    token
  )}&timeout=45`

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileScraperMode: "Profile details no email ($4 per 1k)",
        urls: [url],
      }),
      signal: AbortSignal.timeout(45_000),
    })
  } catch {
    throw new PersonalizationError("Couldn't reach the scraper right now. Try again.", 502)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new PersonalizationError(
      `Profile scrape failed (${res.status}): ${body.slice(0, 200)}`,
      502
    )
  }

  const items = (await res.json()) as HarvestApiProfile[]
  const profile = items?.[0]
  if (!profile || !profile.headline) {
    throw new PersonalizationError(
      "Couldn't find that profile. Make sure the URL is public and correct.",
      404
    )
  }
  return profile
}

function summarizeProfile(profile: HarvestApiProfile): string {
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "this person"
  const role = profile.currentPosition?.position
  const company = profile.currentPosition?.companyName
  const roleLine = role && company ? `${role} at ${company}` : role || ""
  const lines = [
    `Name: ${name}`,
    profile.headline ? `Headline: ${profile.headline}` : "",
    roleLine ? `Current role: ${roleLine}` : "",
    profile.location?.linkedinText ? `Location: ${profile.location.linkedinText}` : "",
    profile.topSkills?.length ? `Top skills: ${profile.topSkills.slice(0, 6).join(", ")}` : "",
    profile.about ? `About (their own words): ${profile.about.slice(0, 800)}` : "",
    profile.experience?.length
      ? `Recent experience: ${profile.experience
          .slice(0, 3)
          .map((e) => `${e.position ?? "?"} at ${e.companyName ?? "?"}`)
          .join("; ")}`
      : "",
  ].filter(Boolean)
  return lines.join("\n")
}

const TYPE_INSTRUCTIONS: Record<MessageType, string> = {
  cold:
    "a cold outreach opener to someone who's never heard from the sender - earn the first line, reference something specific and real from their profile, and end with a light, low-pressure ask.",
  connection:
    "a LinkedIn connection request note - very short (under 300 characters), warm, and specific enough that it clearly isn't a copy-paste template.",
  followup:
    "a follow-up email after an earlier unanswered note - brief, assumes no reply yet, restates the value in one new sentence, and makes it easy to say no.",
}

async function draftMessage(
  profileSummary: string,
  type: MessageType
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new PersonalizationError(
      "Personalizer isn't configured yet (missing GROQ_API_KEY).",
      500
    )
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.6,
      // gpt-oss models reason internally before answering (tokens spent on
      // that come out of this same budget, in a separate `reasoning`
      // field) - reasoning_effort keeps that short, and the higher cap
      // below leaves room for the actual message after it.
      reasoning_effort: "low",
      max_completion_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "You write outbound sales/networking messages that reference specific, real details from a prospect's public LinkedIn profile - never generic flattery. You're building " +
            TYPE_INSTRUCTIONS[type] +
            " Write only the message itself - no subject line, no preamble, no explanation, no quotation marks around it.",
        },
        {
          role: "user",
          content: `Here is the prospect's real, public LinkedIn profile data:\n\n${profileSummary}\n\nThe sender is a product marketer who builds AI-driven marketing automation (outbound personalization, competitive intelligence agents). Write the message now.`,
        },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new PersonalizationError(`Groq request failed (${res.status}): ${body.slice(0, 200)}`, 502)
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new PersonalizationError("Groq returned an empty response. Try again.", 502)
  }
  return content
}

export async function personalizeForUrl(url: string, type: MessageType): Promise<string> {
  if (!isValidLinkedInProfileUrl(url)) {
    throw new PersonalizationError("That doesn't look like a public LinkedIn profile URL.", 400)
  }
  const profile = await scrapeProfile(url.trim())
  const summary = summarizeProfile(profile)
  return draftMessage(summary, type)
}

export { PersonalizationError }
