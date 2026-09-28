// Only ever imported from the app/api route handler below - never from a
// client component - so no separate "server-only" package guard is needed.
import { COMPANY_DOMAINS, isKnownCompany, type Company } from "./competitive-companies"

// llama-3.3-70b-versatile 404'd as "model not found / no access" on the
// live key despite being in Groq's docs - likely an account/tier gate.
// llama-3.1-8b-instant is available on every Groq account with no approval.
const GROQ_MODEL = "llama-3.1-8b-instant"
const MAX_HOMEPAGE_CHARS = 6000

class ResearchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Strips a raw HTML document down to readable body text. Deliberately crude -
// this only needs to give the model enough signal to summarize positioning,
// not to render the page.
function extractVisibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function fetchHomepageText(domain: string): Promise<string> {
  const url = `https://${domain}`
  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new ResearchError(`Couldn't reach ${domain} right now. Try again in a bit.`, 502)
  }

  if (!res.ok) {
    throw new ResearchError(`${domain} responded with ${res.status}. Try again in a bit.`, 502)
  }

  const html = await res.text()
  const text = extractVisibleText(html)

  if (text.length < 100) {
    throw new ResearchError(
      `Got a response from ${domain} but couldn't find enough readable content on it.`,
      502
    )
  }

  return text.slice(0, MAX_HOMEPAGE_CHARS)
}

async function draftBriefing(company: string, homepageText: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new ResearchError("Research agent isn't configured yet (missing GROQ_API_KEY).", 500)
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content:
            "You are a sharp product marketer writing an internal competitive intelligence briefing for a teammate. You're given raw scraped text from a company's live homepage. Write 4-6 tight sentences covering: their core positioning, their primary messaging wedge, how they differentiate, and one honest, specific soft spot in their story. No fluff, no bullet points, no headers - just the briefing as flowing prose, written like an analyst, not a press release. Base every claim only on what's actually in the scraped text.",
        },
        {
          role: "user",
          content: `Company: ${company}\n\nScraped homepage text:\n${homepageText}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new ResearchError(`Groq request failed (${res.status}): ${body.slice(0, 200)}`, 502)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new ResearchError("Groq returned an empty response. Try again.", 502)
  }
  return content
}

export async function researchCompany(companyInput: string): Promise<string> {
  if (!isKnownCompany(companyInput)) {
    throw new ResearchError("Unknown company.", 400)
  }
  const company: Company = companyInput
  const domain = COMPANY_DOMAINS[company]

  const homepageText = await fetchHomepageText(domain)
  return draftBriefing(company, homepageText)
}

export { ResearchError }
