import { Cpu, Zap, TrendingUp } from "lucide-react"
import { Panel } from "./panel"
import { Pill } from "./pill"

export function HomeHero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
      <Panel className="p-6 text-center sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-forest/70">
          {"// product marketing × engineering"}
        </p>

        <h1 className="heading mx-auto mt-6 text-2xl leading-relaxed sm:text-4xl sm:leading-relaxed">
          SHASHWAT
          <br />
          MISHRA
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-forest/90 sm:text-lg">
          <span className="cursor-blink">
            Product marketer who builds the automation most PMMs only ask for
          </span>
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <Pill icon={Cpu}>Engineer turned PMM</Pill>
          <Pill icon={Zap}>Builds AI systems</Pill>
          <Pill icon={TrendingUp}>BFSI decision-intelligence</Pill>
        </div>
      </Panel>
    </section>
  )
}
