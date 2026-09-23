import type { Metadata } from "next"
import { Radar, Globe, FileText } from "lucide-react"
import { CaseStudyShell, Section } from "@/components/case-study"
import { CompetitiveDemo } from "@/components/competitive-demo"

export const metadata: Metadata = {
  title: "Competitive Search Agent — Shashwat Mishra",
  description:
    "A live AI agent that scrapes and summarizes competitor positioning in real time.",
}

export default function CompetitiveSearchPage() {
  return (
    <CaseStudyShell
      title="COMPETITIVE SEARCH AGENT"
      intro="A live AI agent that researches competitors in real time — it scrapes public sources, analyzes how a company positions itself, and drafts a tight briefing. Competitive intel that used to take an afternoon, in under a minute."
      pills={[
        { label: "AI Agent", icon: Radar },
        { label: "Real-time Research", icon: Globe },
        { label: "Auto Briefing", icon: FileText },
      ]}
    >
      <Section title="// WHAT IT DOES">
        <p>
          Competitive research is a chore that decays fast — by the time a deck
          is done, positioning has moved. I built an agent that does the loop on
          demand: gather public signal, analyze the positioning and messaging,
          and summarize it into something a PMM can actually use.
        </p>
        <p>
          It&apos;s a working agent, not a static report. Point it at a company
          and it runs the research live.
        </p>
      </Section>

      <Section title="// HOW IT WORKS">
        <p>
          The agent chains three moves:{" "}
          <span className="font-bold text-forest">research</span> (scrape
          homepages, product pages, and public copy),{" "}
          <span className="font-bold text-forest">analyze</span> (extract the
          core message, wedge, and target segment), and{" "}
          <span className="font-bold text-forest">draft</span> (write a concise
          briefing with a likely soft spot). The demo below uses a fixed set of
          example companies.
        </p>
      </Section>

      <CompetitiveDemo />
    </CaseStudyShell>
  )
}
