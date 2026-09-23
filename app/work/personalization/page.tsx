import type { Metadata } from "next"
import { Bot, Mail, TrendingUp, Search, Wand2, PenLine, ArrowRight } from "lucide-react"
import { CaseStudyShell, Section } from "@/components/case-study"
import { Panel } from "@/components/panel"
import { PersonalizationDemo } from "@/components/personalization-demo"

export const metadata: Metadata = {
  title: "Personalization Pipeline — Shashwat Mishra",
  description:
    "An AI-driven personalization pipeline for outbound email: research, personalize, draft. 50–70% open-rate lift, 30–40% click-rate lift.",
}

export default function PersonalizationPage() {
  return (
    <CaseStudyShell
      title="PERSONALIZATION PIPELINE"
      intro="I built an AI personalization pipeline for outbound email — Python, web scraping, and LLM generation stitched into one flow. It researches each prospect, personalizes the angle, and drafts the message. The numbers moved."
      pills={[
        { label: "AI Automation", icon: Bot },
        { label: "Outbound Email", icon: Mail },
        { label: "Measurable Lift", icon: TrendingUp },
      ]}
    >
      {/* Metric callouts */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MetricPanel value="+50–70%" label="Open rate lift" />
        <MetricPanel value="+30–40%" label="Click rate lift" />
      </section>

      <Section title="// WHAT IT DOES">
        <p>
          Most outbound is either generic-at-scale or personalized-but-slow. The
          pipeline collapses that tradeoff: it pulls public signal on each
          prospect, reasons about the most relevant hook, and drafts a message
          that reads like a human wrote it for one person.
        </p>
        <p>
          Built in Python — scraping and enrichment feed an LLM generation step,
          with guardrails so the output stays on-voice and on-offer.
        </p>
      </Section>

      {/* Pipeline diagram */}
      <section>
        <h2 className="heading mb-5 text-[0.85rem] sm:text-base">// THE PIPELINE</h2>
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <PipeStep
              icon={<Search className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
              title="Research"
              body="Scrape & enrich public prospect signal."
            />
            <PipeArrow />
            <PipeStep
              icon={<Wand2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
              title="Personalize"
              body="Pick the most relevant angle per prospect."
            />
            <PipeArrow />
            <PipeStep
              icon={<PenLine className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
              title="Draft"
              body="Generate an on-voice, ready-to-send message."
            />
          </div>
        </Panel>
      </section>

      <PersonalizationDemo />
    </CaseStudyShell>
  )
}

function MetricPanel({ value, label }: { value: string; label: string }) {
  return (
    <Panel className="bg-mustard/15 p-6 text-center">
      <div className="heading text-xl sm:text-2xl">{value}</div>
      <div className="mt-3 text-xs font-bold uppercase tracking-wide text-forest/80">
        {label}
      </div>
    </Panel>
  )
}

function PipeStep({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex-1 rounded border-2 border-forest bg-cream/70 p-4 text-center">
      <div className="flex justify-center text-forest">{icon}</div>
      <div className="heading mt-3 text-[0.7rem]">{title}</div>
      <p className="mt-2 text-xs leading-relaxed text-forest/80">{body}</p>
    </div>
  )
}

function PipeArrow() {
  return (
    <div className="flex justify-center text-forest/70">
      <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" strokeWidth={2.5} aria-hidden="true" />
    </div>
  )
}
