"use client"

import { useState } from "react"
import { Radar, Loader2, TriangleAlert } from "lucide-react"
import { Panel } from "./panel"

const STAGES = [
  "Crawling homepage...",
  "Checking for a LinkedIn company page...",
  "Comparing against last check...",
  "Drafting briefing...",
]

export function CompetitiveDemo() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  async function handleResearch() {
    if (!url.trim()) return
    setLoading(true)
    setResult("")
    setError("")

    // Cosmetic staging so the real, multi-step pipeline (crawl, LinkedIn
    // lookup, change-detection, LLM) doesn't feel like a silent hang - the
    // whole thing typically takes 30-45s.
    let stageIndex = 0
    setStage(STAGES[0])
    const stageTimer = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, STAGES.length - 1)
      setStage(STAGES[stageIndex])
    }, 9000)

    try {
      const res = await fetch("/api/competitive-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      let data: { briefing?: string; error?: string } = {}
      try {
        data = await res.json()
      } catch {
        // A platform-level failure (like a function timeout) returns an
        // HTML/plain-text error page, not JSON - don't let that crash the
        // UI with a raw parse error.
        throw new Error(
          res.status === 504 || res.status === 502
            ? "That took too long and timed out. Try again - it's sometimes just a slow site."
            : "Something went wrong. Try again."
        )
      }
      if (!res.ok || !data.briefing) {
        throw new Error(data.error || "Something went wrong. Try again.")
      }
      setResult(data.briefing)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      clearInterval(stageTimer)
      setStage("")
      setLoading(false)
    }
  }

  return (
    <Panel className="p-6 sm:p-8">
      <h2 className="heading text-[0.85rem] sm:text-base">// RUN THE AGENT</h2>
      <p className="mt-4 text-sm leading-relaxed text-forest/85">
        Paste any company&apos;s URL. The agent crawls their homepage, looks
        for recent LinkedIn activity, checks whether it has seen this site
        before, and drafts a positioning briefing from it. Takes about
        20-30 seconds.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr] sm:items-end">
        <div>
          <label
            htmlFor="company-url"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest/80"
          >
            Company URL
          </label>
          <input
            id="company-url"
            type="text"
            inputMode="url"
            placeholder="e.g. ramp.com"
            className="field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <button onClick={handleResearch} disabled={loading || !url.trim()} className="btn-cta">
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
        <div className="min-h-32 rounded border-2 border-forest bg-cream/70 p-4 font-mono text-sm leading-relaxed text-forest whitespace-pre-line">
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
