import type { Metadata } from "next"
import { Radar, Globe, FileText } from "lucide-react"
import { CaseStudyShell, Section } from "@/components/case-study"
import { CompetitiveDemo } from "@/components/competitive-demo"

export const metadata: Metadata = {
  title: "Competitive Search Agent - Shashwat Mishra",
  description:
    "A live AI agent that scrapes and summarizes competitor positioning in real time.",
}

export default function CompetitiveSearchPage() {
  return (
    <CaseStudyShell
      title="COMPETITIVE SEARCH AGENT"
      intro="A live AI agent that researches competitors in real time. It scrapes public sources, analyzes how a company positions itself, and drafts a tight briefing. Competitive intel that used to take an afternoon, now takes under a minute."
      pills={[
        { label: "AI Agent", icon: Radar },
        { label: "Real-time Research", icon: Globe },
        { label: "Auto Briefing", icon: FileText },
      ]}
    >
      <Section title="// WHAT IT DOES">
        <p>
          Competitive research is a chore that decays fast. By the time a deck
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
          The agent chains four moves:{" "}
          <span className="font-bold text-forest">fetch</span> (their live
          homepage - body text plus meta tags, so even a mostly
          client-rendered site still gives up a positioning summary),{" "}
          <span className="font-bold text-forest">cross-check</span>{" "}
          (looks for a LinkedIn company page and pulls recent posts when it
          finds one), <span className="font-bold text-forest">watch</span>{" "}
          (fingerprints the site&apos;s content and remembers it, so a repeat
          check can say whether anything actually changed), and{" "}
          <span className="font-bold text-forest">draft</span> (write a
          concise briefing with a likely soft spot). Paste any company&apos;s
          URL below, not a fixed list.
        </p>
        <p>
          One thing that surfaced while building this: some sites embed text
          aimed at AI agents specifically, like a fake reward for repeating a
          phrase. The prompt is written to treat all scraped content as data
          to analyze, never as instructions to follow.
        </p>
      </Section>

      <CompetitiveDemo />
    </CaseStudyShell>
  )
}
