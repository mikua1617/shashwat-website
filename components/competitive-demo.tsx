"use client"

import { useState } from "react"
import { Radar, Loader2, TriangleAlert } from "lucide-react"
import { Panel } from "./panel"
import { COMPANIES } from "@/lib/competitive-companies"

const STAGES = ["Fetching live homepage...", "Analyzing positioning..."]

export function CompetitiveDemo() {
  const [company, setCompany] = useState(COMPANIES[0])
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  async function handleResearch() {
    setLoading(true)
    setResult("")
    setError("")

    // Purely cosmetic staging so the two real steps (fetch, then LLM) don't
    // feel like a blank hang while the request is in flight.
    setStage(STAGES[0])
    const stageTimer = setTimeout(() => setStage(STAGES[1]), 3500)

    try {
      const res = await fetch("/api/competitive-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      })
      const data = (await res.json()) as { briefing?: string; error?: string }
      if (!res.ok || !data.briefing) {
        throw new Error(data.error || "Something went wrong. Try again.")
      }
      setResult(data.briefing)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      clearTimeout(stageTimer)
      setStage("")
      setLoading(false)
    }
  }

  return (
    <Panel className="p-6 sm:p-8">
      <h2 className="heading text-[0.85rem] sm:text-base">// RUN THE AGENT</h2>
      <p className="mt-4 text-sm leading-relaxed text-forest/85">
        Pick a company - the agent fetches their live homepage right now and
        drafts a positioning briefing from it.
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
            disabled={loading}
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
            <span className="inline-flex items-center gap-2 text-forest/70">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {stage}
            </span>
          )}
          {!loading && error && (
            <span className="inline-flex items-start gap-2 text-red-700">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </span>
          )}
          {!loading && !error && result && <p>{result}</p>}
          {!loading && !error && !result && (
            <span className="text-forest/50">
              {"// competitor briefing will appear here"}
            </span>
          )}
        </div>
      </div>
    </Panel>
  )
}
