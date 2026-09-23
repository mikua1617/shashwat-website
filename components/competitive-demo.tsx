"use client"

import { useState } from "react"
import { Radar, Loader2 } from "lucide-react"
import { Panel } from "./panel"

const COMPANIES = [
  "Stripe",
  "Ramp",
  "Brex",
  "Plaid",
  "Mercury",
  "Bill.com",
  "Rippling",
  "Deel",
  "Navan",
  "Airbase",
]

const STAGES = ["Researching...", "Analyzing...", "Drafting..."]

// Placeholder generator — swap for the real /api/competitive-research call.
function summarize(company: string): string {
  return `${company} positions around an all-in-one, developer-friendly platform that consolidates fragmented finance/ops tooling into a single system of record. Core message: replace a patchwork of point solutions with one integrated layer, reduce manual work, and get real-time visibility. Primary wedge is a fast, self-serve onboarding motion aimed at mid-market teams, expanding upward into enterprise. Differentiation leans on speed-to-value and breadth of native integrations rather than depth in any single category. Likely soft spot: as the surface area grows, "does everything" messaging risks diluting a sharp reason-to-switch for buyers who already own a category leader.`
}

export function CompetitiveDemo() {
  const [company, setCompany] = useState(COMPANIES[0])
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState("")
  const [result, setResult] = useState("")

  async function handleResearch() {
    setLoading(true)
    setResult("")
    for (const s of STAGES) {
      setStage(s)
      await new Promise((r) => setTimeout(r, 1000))
    }
    setResult(summarize(company))
    setStage("")
    setLoading(false)
  }

  return (
    <Panel className="p-6 sm:p-8">
      <h2 className="heading text-[0.85rem] sm:text-base">// RUN THE AGENT</h2>
      <p className="mt-4 text-sm leading-relaxed text-forest/85">
        Pick a company and the agent researches its positioning, then drafts a
        summary.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr] sm:items-end">
        <div>
          <label
            htmlFor="company"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest/80"
          >
            Target company
          </label>
          <select
            id="company"
            className="field"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleResearch} disabled={loading} className="btn-cta">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Radar className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          )}
          {loading ? "Working..." : "Research"}
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-forest/80">
          Briefing
        </div>
        <div className="min-h-32 rounded border-2 border-forest bg-cream/70 p-4 font-mono text-sm leading-relaxed text-forest">
          {loading && (
            <div className="space-y-1 text-forest/70">
              {STAGES.map((s) => {
                const idx = STAGES.indexOf(s)
                const current = STAGES.indexOf(stage)
                const done = idx < current
                const active = s === stage
                return (
                  <p key={s} className="inline-flex items-center gap-2">
                    {active ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <span className="inline-block w-3.5 text-center">
                        {done ? "✓" : "·"}
                      </span>
                    )}
                    <span className={active ? "text-forest" : ""}>{s}</span>
                  </p>
                )
              })}
            </div>
          )}
          {!loading && result && <p>{result}</p>}
          {!loading && !result && (
            <span className="text-forest/50">
              {"// competitor briefing will appear here"}
            </span>
          )}
        </div>
      </div>
    </Panel>
  )
}
