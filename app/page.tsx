import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { ProjectCard } from "@/components/project-card"
import { Panel } from "@/components/panel"
import { projects } from "@/lib/projects"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <HomeHero />

      {/* About */}
      <section id="about" className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <Panel className="p-6 sm:p-10">
          <h2 className="heading text-[0.85rem] sm:text-base">// ABOUT</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-forest/90 sm:text-base">
            <p>
              I&apos;m a product marketer who builds. Six-plus years running GTM,
              demand gen, and positioning across BFSI, enterprise IT, and AI/SaaS,
              and most of what I build lives just behind the words: pipelines
              that pull the right signal on a prospect before an email goes
              out, agents that watch a competitor&apos;s site for what changed,
              models fine-tuned to draft in something close to my own voice.
              Built to get me to the actual writing faster, never past it.
            </p>
            <p>
              That instinct started early, through a product studio stint
              writing software and an MBA in marketing from IIM Calcutta to
              sharpen the go-to-market side, and it&apos;s carried through every
              role since: shipping beats theorizing.
            </p>
            <p>
              Today I do product marketing at a BFSI-focused AI startup, where
              that instinct shows up as personalization pipelines, fine-tuned
              models, and research agents. The positioning is simple: a marketer
              who ships real automation, not just campaigns.
            </p>
          </div>
        </Panel>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="heading text-[0.85rem] sm:text-base">// SELECTED WORK</h2>
          <span className="text-xs text-forest/60">{`[${projects.length}] projects`}</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
