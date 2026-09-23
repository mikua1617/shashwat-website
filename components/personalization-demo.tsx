"use client"

import { useState } from "react"
import { Sparkles, Loader2, Lock } from "lucide-react"
import { Panel } from "./panel"

type MessageType = "cold" | "connection" | "followup"

const MESSAGE_TYPES: { value: MessageType; label: string }[] = [
  { value: "cold", label: "Cold outreach opener" },
  { value: "connection", label: "LinkedIn connection note" },
  { value: "followup", label: "Follow-up email" },
]

const STAGES = ["Researching profile...", "Drafting message..."]

// Placeholder generator — swap for the real /api/personalize call later.
function draftMessage(url: string, type: MessageType): string {
  const handle = url.split("/").filter(Boolean).pop() ?? "there"
  const name = handle.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  switch (type) {
    case "cold":
      return `Hi ${name} — noticed you're driving GTM at a fast-moving team. I build the automation layer behind outbound (research + personalization + drafting) so reps stop copy-pasting. Worth a quick look at what a 50–70% open-rate lift did for a similar team?`
    case "connection":
      return `Hi ${name}, we keep orbiting the same PMM + automation circles. I build AI systems for outbound personalization and I'd love to swap notes on what's actually working right now.`
    case "followup":
      return `Hi ${name}, circling back on my note. Short version: I built a pipeline that researches each prospect and drafts genuinely personalized outreach at scale — 30–40% lift in click rate. Happy to send a 2-minute teardown if useful.`
  }
}

export function PersonalizationDemo() {
  const [url, setUrl] = useState("")
  const [type, setType] = useState<MessageType>("cold")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState("")
  const [result, setResult] = useState("")

  async function handleGenerate() {
    if (!url.trim()) return
    setLoading(true)
    setResult("")
    for (const s of STAGES) {
      setStage(s)
      await new Promise((r) => setTimeout(r, 1100))
    }
    setResult(draftMessage(url.trim(), type))
    setStage("")
    setLoading(false)
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
          {!loading && result && <p>{result}</p>}
          {!loading && !result && (
            <span className="text-forest/50">
              {"// generated draft will appear here"}
            </span>
          )}
        </div>
      </div>
    </Panel>
  )
}
