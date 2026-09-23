import type { Metadata } from "next"
import { Gamepad2, Calendar, Cpu, Coins, Crosshair, Trophy } from "lucide-react"
import { CaseStudyShell, Section } from "@/components/case-study"
import { Panel } from "@/components/panel"
import { DosPlayerEmbed } from "@/components/dos-player-embed"

export const metadata: Metadata = {
  title: "The Collector — Shashwat Mishra",
  description:
    "A maze game built at 15 in Borland Turbo C++, now playable in-browser via js-dos — the original compiled binary, not a rewrite.",
}

export default function TheCollectorPage() {
  return (
    <CaseStudyShell
      title="THE COLLECTOR"
      intro="A maze game I built at 15 in Borland Turbo C++ under the studio name Shaved Adlabs Productions. Coins, bribes, bullets, high scores — the full arcade loop. It was DOS-only for years. Now it runs in your browser."
      pills={[
        { label: "Builder Origin", icon: Gamepad2 },
        { label: "Est. ~2010", icon: Calendar },
        { label: "Turbo C++ / DOS", icon: Cpu },
      ]}
    >
      <section>
        <h2 className="heading mb-5 text-[0.85rem] sm:text-base">// PLAY IT</h2>
        <Panel className="p-4 sm:p-6">
          <DosPlayerEmbed />
          <p className="mt-4 text-center text-xs text-forest/70">
            Runs the original compiled binary via js-dos emulation — not a
            rewrite, not a remake.
          </p>
        </Panel>
      </section>

      <Section title="// THE GAME">
        <p>
          The Collector is a top-down maze game. You navigate corridors,
          collect coins to raise your score, and manage a set of mechanics that
          were ambitious for a 15-year-old&apos;s side project:
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Coins className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            title="Coin Collection"
            body="Sweep the maze for coins to drive up your score."
          />
          <FeatureCard
            icon={<Trophy className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            title="Bribe Mechanic"
            body="Spend what you collect to buy your way past obstacles."
          />
          <FeatureCard
            icon={<Crosshair className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            title="Bullets & High Scores"
            body="Shoot to survive; the high score table keeps you honest."
          />
        </div>
      </Section>

      <Section title="// FROM DOS TO BROWSER">
        <p>
          The game was written in Borland Turbo C++ and compiled to a DOS
          executable. For most of its life it only ran on machines that could
          boot DOS or DOSBox.
        </p>
        <p>
          Rather than rebuild it in JavaScript, I kept the{" "}
          <span className="text-forest font-bold">exact original binary</span>{" "}
          and run it through js-dos, a WebAssembly build of DOSBox. What you
          play here is the same bytes I compiled as a teenager — preserved, not
          reinterpreted.
        </p>
      </Section>

      <Panel className="bg-mustard/15 p-6 sm:p-8">
        <p className="heading text-[0.8rem] leading-relaxed sm:text-sm">
          &quot;BUILDER AT 15, BUILDER NOW — SAME INSTINCT, DIFFERENT STACK.&quot;
        </p>
        <p className="mt-4 text-sm leading-relaxed text-forest/85">
          I don&apos;t write briefs and hope. I&apos;ve been shipping working
          software since before it was my job. The tools changed from Turbo C++
          to Python and LLMs — the instinct to actually build the thing
          didn&apos;t.
        </p>
      </Panel>
    </CaseStudyShell>
  )
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2 text-forest">
        {icon}
        <span className="text-sm font-bold uppercase">{title}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-forest/80">{body}</p>
    </Panel>
  )
}
