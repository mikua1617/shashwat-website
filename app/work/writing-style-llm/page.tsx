import type { Metadata } from "next"
import { BrainCircuit, Database, SlidersHorizontal, CheckCheck } from "lucide-react"
import { CaseStudyShell, Section } from "@/components/case-study"
import { Panel } from "@/components/panel"

export const metadata: Metadata = {
  title: "Writing Style LLM — Shashwat Mishra",
  description:
    "Fine-tuned an open-weight LLM with LoRA on a personal writing corpus to reproduce voice and style.",
}

export default function WritingStyleLlmPage() {
  return (
    <CaseStudyShell
      title="WRITING STYLE LLM"
      intro="I fine-tuned an open-weight language model on a corpus of my own writing so it could reproduce my voice — cadence, word choice, the way I structure an argument. This is the method, the tradeoffs, and a before/after."
      pills={[
        { label: "Applied ML", icon: BrainCircuit },
        { label: "LoRA Fine-tune", icon: SlidersHorizontal },
        { label: "Personal Corpus", icon: Database },
      ]}
    >
      <Section title="// THE GOAL">
        <p>
          Generic models write competent, forgettable prose. I wanted a model
          that sounded like <span className="font-bold text-forest">me</span> —
          useful for drafting at speed without losing voice. The task: teach an
          open-weight base model my style from my own writing.
        </p>
      </Section>

      <section>
        <h2 className="heading mb-5 text-[0.85rem] sm:text-base">// METHOD</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <MethodCard
            icon={<Database className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            step="01"
            title="Dataset"
            body="Assembled a personal corpus — essays, notes, and long-form posts — cleaned and formatted into instruction/response pairs that isolate voice from topic."
          />
          <MethodCard
            icon={<SlidersHorizontal className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            step="02"
            title="LoRA Fine-tuning"
            body="Chose LoRA over full fine-tuning: adapters train a small set of low-rank weights, so it's cheap, fast, and easy to iterate without touching the base model."
          />
          <MethodCard
            icon={<CheckCheck className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            step="03"
            title="Evaluation"
            body="Blind side-by-side comparisons against the base model on held-out prompts, scoring for voice match and coherence — not just fluency."
          />
        </div>
      </section>

      {/* Before / After */}
      <section>
        <h2 className="heading mb-5 text-[0.85rem] sm:text-base">
          // BEFORE / AFTER
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-forest/85">
          Same prompt:{" "}
          <span className="font-bold text-forest">
            &quot;Explain why our onboarding flow needs work.&quot;
          </span>
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ComparePanel
            label="Base model"
            tone="text-forest/70"
            heading="GENERIC"
          >
            Our onboarding flow presents several opportunities for improvement.
            By streamlining the user journey and reducing friction points, we
            can enhance the overall customer experience and drive higher
            activation rates across the funnel.
          </ComparePanel>
          <ComparePanel
            label="Fine-tuned model"
            tone="text-forest"
            heading="MY VOICE"
            highlight
          >
            Onboarding is where we lose people, and we lose them for a boring
            reason: we ask for too much before we&apos;ve earned it. Cut the
            first three steps. Show one win fast. Everything else can wait until
            they actually care.
          </ComparePanel>
        </div>
      </section>
    </CaseStudyShell>
  )
}

function MethodCard({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode
  step: string
  title: string
  body: string
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between text-forest">
        <span className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold uppercase">{title}</span>
        </span>
        <span className="heading text-[0.7rem] text-forest/50">{step}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-forest/80">{body}</p>
    </Panel>
  )
}

function ComparePanel({
  label,
  heading,
  tone,
  highlight,
  children,
}: {
  label: string
  heading: string
  tone: string
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <Panel className={highlight ? "bg-mustard/15 p-6" : "p-6"}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-forest/80">
          {label}
        </span>
        <span className="rounded border border-forest px-2 py-0.5 text-[0.6rem] font-bold uppercase text-forest">
          {heading}
        </span>
      </div>
      <p className={`mt-4 text-sm leading-relaxed ${tone}`}>{children}</p>
    </Panel>
  )
}
