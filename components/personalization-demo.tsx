"use client"

import { useState } from "react"
import { Sparkles, Loader2, Lock, TriangleAlert } from "lucide-react"
import { Panel } from "./panel"

type MessageType = "cold" | "connection" | "followup"

const MESSAGE_TYPES: { value: MessageType; label: string }[] = [
  { value: "cold", label: "Cold outreach opener" },
  { value: "connection", label: "LinkedIn connection note" },
  { value: "followup", label: "Follow-up email" },
]

const STAGES = ["Scraping public profile...", "Drafting message..."]

export function PersonalizationDemo() {
  const [url, setUrl] = useState("")
  const [type, setType] = useState<MessageType>("cold")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  async function handleGenerate() {
    if (!url.trim()) return
    setLoading(true)
    setResult("")
    setError("")

    // Cosmetic staging so the (real) network round-trip doesn't feel like a
    // silent hang - the actual work happens in the single API call below.
    setStage(STAGES[0])
    const stageTimer = setTimeout(() => setStage(STAGES[1]), 2500)

    try {
      const res = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), type }),
      })
      const data = (await res.json()) as { draft?: string; error?: string }
      if (!res.ok || !data.draft) {
        throw new Error(data.error || "Something went wrong. Try again.")
      }
      setResult(data.draft)
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
      <h2 className="heading text-[0.85rem] sm:text-base">// TRY THE PERSONALIZER</h2>
      <p className="mt-4 text-sm leading-relaxed text-forest/85">
        Paste a public LinkedIn URL, pick a message type, and generate a draft.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label
            htmlFor="li-url"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest/80"
          >
            LinkedIn URL
          </label>
          <input
            id="li-url"
            type="url"
            inputMode="url"
            placeholder="https://linkedin.com/in/..."
            className="field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="msg-type"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest/80"
          >
            Message type
          </label>
          <select
            id="msg-type"
            className="field"
            value={type}
            onChange={(e) => setType(e.target.value as MessageType)}
            disabled={loading}
          >
            {MESSAGE_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !url.trim()}
          className="btn-cta"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          )}
          {loading ? "Working..." : "Generate"}
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-forest/70">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Uses only your public LinkedIn profile info — nothing is stored.
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-forest/80">
          Output
        </div>
        <div className="min-h-28 rounded border-2 border-forest bg-cream/70 p-4 font-mono text-sm leading-relaxed text-forest">
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
              {"// generated draft will appear here"}
            </span>
          )}
        </div>
      </div>
    </Panel>
  )
}
